/**
 * Contact page enquiry form — client validation, spam guards, submit.
 * Posts to /api/enquiry. Server re-validates everything (never trust the client).
 */
(function () {
  const form = document.getElementById("enquiry-form");
  if (!form) return;

  const renderedAt = Date.now();
  const statusEl = form.querySelector("[data-form-status]");
  const submitBtn = form.querySelector("[data-submit-btn]");
  const honeypot = form.querySelector("[data-honeypot]");

  const PROJECTS = [
    "madina-heights", "madina-heights-1", "madina-heights-2", "madina-heights-3",
    "madina-heights-4", "madina-heights-5", "madina-silver-heights",
    "madina-homes", "la-monte-vista", "madina-mall-residency"
  ];
  const ENQUIRY_TYPES = ["buying", "investment", "booking", "site-visit", "general"];

  function field(id) { return form.querySelector("#" + id); }

  function setError(id, msg) {
    const el = form.querySelector('[data-error-for="' + id + '"]');
    const input = field(id) || form.querySelector('input[name="enquiryType"]');
    if (el) {
      el.textContent = msg || "";
      el.hidden = !msg;
    }
    const target = id === "enquiryType" ? form.querySelector(".radio-group") : (id && field(id));
    if (target) target.setAttribute("aria-invalid", msg ? "true" : "false");
    return !msg;
  }

  function setStatus(msg, kind) {
    statusEl.hidden = !msg;
    statusEl.textContent = msg || "";
    statusEl.className = "form-status" + (kind ? " is-" + kind : "");
  }

  function validate() {
    let ok = true;
    const name = field("f-name").value.trim();
    const email = field("f-email").value.trim();
    const phone = field("f-phone").value.trim();
    const project = field("f-project").value;
    const enquiryType = (form.querySelector('input[name="enquiryType"]:checked') || {}).value;
    const message = field("f-message").value.trim();

    ok = setError("f-name", name.length >= 2 ? "" : "Please enter your full name.") && ok;
    ok = setError("f-email", /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) ? "" : "Please enter a valid email address.") && ok;
    ok = setError("f-phone", /^[+\d][\d\s\-()]{6,17}$/.test(phone) ? "" : "Please enter a valid phone number.") && ok;
    ok = setError("f-project", PROJECTS.indexOf(project) !== -1 ? "" : "Please choose a project.") && ok;
    ok = setError("enquiryType", ENQUIRY_TYPES.indexOf(enquiryType) !== -1 ? "" : "Please choose an enquiry type.") && ok;
    ok = setError("f-message", message.length >= 10 ? "" : "Please tell us a little more (min 10 characters).") && ok;
    return ok;
  }

  ["f-name", "f-email", "f-phone", "f-project", "f-message"].forEach(function (id) {
    const el = field(id);
    if (el) el.addEventListener("input", function () { setError(id, ""); });
  });
  form.querySelectorAll('input[name="enquiryType"]').forEach(function (r) {
    r.addEventListener("change", function () { setError("enquiryType", ""); });
  });

  // Client-side rate limit: one submission per 60s per browser.
  function rateLimited() {
    try {
      const last = Number(localStorage.getItem("rt-enquiry-last") || 0);
      return Date.now() - last < 60000;
    } catch (e) { return false; }
  }
  function stampRateLimit() {
    try { localStorage.setItem("rt-enquiry-last", String(Date.now())); } catch (e) {}
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    setStatus("", "");

    // Honeypot: bots fill it; humans never see it. Fail silently-ish.
    if (honeypot && honeypot.value) {
      setStatus("Thank you — your enquiry has been received.", "success");
      form.reset();
      return;
    }
    // Time-trap: submitted suspiciously fast.
    if (Date.now() - renderedAt < 2500) {
      setStatus("Please take a moment to complete the form before submitting.", "error");
      return;
    }
    if (rateLimited()) {
      setStatus("You've just sent an enquiry — please wait a minute before sending another.", "error");
      return;
    }
    if (!validate()) {
      setStatus("Please fix the highlighted fields and try again.", "error");
      const firstInvalid = form.querySelector('[aria-invalid="true"]');
      if (firstInvalid && firstInvalid.focus) firstInvalid.focus();
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Sending…";

    const payload = {
      name: field("f-name").value.trim(),
      email: field("f-email").value.trim(),
      phone: field("f-phone").value.trim(),
      project: field("f-project").value,
      enquiryType: form.querySelector('input[name="enquiryType"]:checked').value,
      budget: field("f-budget").value.trim(),
      message: field("f-message").value.trim()
    };

    fetch("/api/enquiry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
      .then(function (res) { return res.json().catch(function () { return {}; }).then(function (d) { return { status: res.status, data: d }; }); })
      .then(function (out) {
        submitBtn.disabled = false;
        submitBtn.textContent = "Submit Enquiry";
        if (out.status === 200 && out.data && out.data.ok) {
          stampRateLimit();
          form.reset();
          setStatus("Thank you — your enquiry has been sent. Our team will get back to you shortly.", "success");
        } else if (out.status === 429) {
          setStatus("Too many attempts — please wait a few minutes and try again.", "error");
        } else if (out.data && out.data.error) {
          setStatus(out.data.error, "error");
        } else {
          setStatus("Something went wrong sending your enquiry. Please try again, or call us on 0312 4455477.", "error");
        }
      })
      .catch(function () {
        submitBtn.disabled = false;
        submitBtn.textContent = "Submit Enquiry";
        setStatus("Something went wrong sending your enquiry. Please try again, or call us on 0312 4455477.", "error");
      });
  });
})();
