/**
 * POST /api/enquiry — contact-page enquiry form handler.
 *
 * Validation: full server-side re-validation (never trust the client).
 * Spam guards: honeypot (checked client-side too), time-trap is client-side
 * only, basic per-IP in-memory rate limiting here.
 *
 * Sending: via Resend (https://resend.com) HTTP API — no extra dependency.
 * Required Vercel env vars:
 *   RESEND_API_KEY   — Resend API key (get from resend.com/api-keys)
 *   CONTACT_FROM     — e.g. "RealTek Website <website@realtekdevelopers.com>"
 *                      (must be a verified sender/domain in Resend)
 *   CONTACT_TO       — recipient, defaults to info@realtek.pk
 *
 * Until RESEND_API_KEY is set, the endpoint returns 503 with a clear message
 * (and the client surfaces it). Nothing is silently dropped.
 */

const PROJECTS = new Set([
  "madina-heights", "madina-heights-1", "madina-heights-2", "madina-heights-3",
  "madina-heights-4", "madina-heights-5", "madina-silver-heights",
  "madina-homes", "la-monte-vista", "madina-mall-residency",
]);

const PROJECT_LABELS = {
  "madina-heights": "Madina Heights — All Phases",
  "madina-heights-1": "Madina Heights 1",
  "madina-heights-2": "Madina Heights 2",
  "madina-heights-3": "Madina Heights 3",
  "madina-heights-4": "Madina Heights 4",
  "madina-heights-5": "Madina Heights 5",
  "madina-silver-heights": "Madina Silver Heights",
  "madina-homes": "Madina Homes",
  "la-monte-vista": "La Monte Vista",
  "madina-mall-residency": "Madina Mall & Residency",
};

const ENQUIRY_TYPES = new Set(["buying", "investment", "booking", "site-visit", "general"]);

const ENQUIRY_LABELS = {
  buying: "Buying a property",
  investment: "Investment",
  booking: "Booking and payment plan",
  "site-visit": "Schedule a site visit",
  general: "General inquiry",
};

// --- rate limiting (in-memory; fine for a low-volume form) ---
const hits = new Map(); // ip -> [timestamps]
const WINDOW_MS = 10 * 60 * 1000;
const MAX_HITS = 10;

function rateLimited(ip) {
  const now = Date.now();
  const arr = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  arr.push(now);
  hits.set(ip, arr);
  return arr.length > MAX_HITS;
}

function clientIp(req) {
  const fwd = req.headers["x-forwarded-for"];
  if (typeof fwd === "string" && fwd) return fwd.split(",")[0].trim();
  return (req.socket && req.socket.remoteAddress) || "unknown";
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", (c) => {
      raw += c;
      if (raw.length > 64 * 1024) {
        reject(new Error("body too large"));
        req.destroy();
      }
    });
    req.on("end", () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch (e) {
        reject(new Error("invalid json"));
      }
    });
    req.on("error", reject);
  });
}

function clean(v, max) {
  return String(v == null ? "" : v).trim().slice(0, max || 2000);
}

function validate(body) {
  const name = clean(body.name, 120);
  const email = clean(body.email, 160);
  const phone = clean(body.phone, 40);
  const project = clean(body.project, 60);
  const enquiryType = clean(body.enquiryType, 40);
  const budget = clean(body.budget, 120);
  const message = clean(body.message, 5000);

  const errors = {};
  if (name.length < 2) errors.name = "Please enter your full name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) errors.email = "Please enter a valid email address.";
  if (!/^[+\d][\d\s\-()]{6,17}$/.test(phone)) errors.phone = "Please enter a valid phone number.";
  if (!PROJECTS.has(project)) errors.project = "Please choose a valid project.";
  if (!ENQUIRY_TYPES.has(enquiryType)) errors.enquiryType = "Please choose a valid enquiry type.";
  if (message.length < 10) errors.message = "Please tell us a little more (min 10 characters).";

  return { errors, data: { name, email, phone, project, enquiryType, budget, message } };
}

async function sendViaResend(data) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { ok: false, reason: "not_configured" };

  const from = process.env.CONTACT_FROM || "RealTek Website <website@realtekdevelopers.com>";
  const to = process.env.CONTACT_TO || "info@realtek.pk";

  const subject = `Website enquiry — ${PROJECT_LABELS[data.project]} (${ENQUIRY_LABELS[data.enquiryType]})`;
  const text =
    `New enquiry from realtekdevelopers.com/contact-us/\n\n` +
    `Name: ${data.name}\n` +
    `Email: ${data.email}\n` +
    `Phone: ${data.phone}\n` +
    `Project of interest: ${PROJECT_LABELS[data.project]}\n` +
    `Enquiry type: ${ENQUIRY_LABELS[data.enquiryType]}\n` +
    `Approximate budget: ${data.budget || "—"}\n\n` +
    `Message:\n${data.message}\n`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to: [to], reply_to: data.email, subject, text }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    console.error("Resend error:", res.status, detail.slice(0, 500));
    return { ok: false, reason: "send_failed" };
  }
  return { ok: true };
}

export default async function handler(req, res) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "POST") {
    res.statusCode = 405;
    res.end(JSON.stringify({ error: "Method not allowed." }));
    return;
  }

  const ip = clientIp(req);
  if (rateLimited(ip)) {
    res.statusCode = 429;
    res.end(JSON.stringify({ error: "Too many attempts — please wait a few minutes and try again." }));
    return;
  }

  let body;
  try {
    body = await readJsonBody(req);
  } catch (e) {
    res.statusCode = 400;
    res.end(JSON.stringify({ error: "Invalid request." }));
    return;
  }

  // Honeypot — bots fill hidden fields. Pretend success so they move on.
  if (body.company) {
    res.statusCode = 200;
    res.end(JSON.stringify({ ok: true }));
    return;
  }

  const { errors, data } = validate(body);
  if (Object.keys(errors).length) {
    res.statusCode = 400;
    res.end(JSON.stringify({ error: "Please check the form and try again.", fields: errors }));
    return;
  }

  const result = await sendViaResend(data);
  if (!result.ok && result.reason === "not_configured") {
    res.statusCode = 503;
    res.end(
      JSON.stringify({
        error:
          "Our enquiry service is being set up — please call us on 0312 4455477 or email info@realtek.pk and we'll help right away.",
      })
    );
    return;
  }
  if (!result.ok) {
    res.statusCode = 502;
    res.end(
      JSON.stringify({
        error: "Something went wrong sending your enquiry. Please try again, or call us on 0312 4455477.",
      })
    );
    return;
  }

  res.statusCode = 200;
  res.end(JSON.stringify({ ok: true }));
}
