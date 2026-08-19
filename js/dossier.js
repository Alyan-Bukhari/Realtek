/**
 * Project dossier — Zee99-style subnav, residences, commercial, payment.
 * Madina Mall uses published rates (Rs 13,500 / sq. ft. residential).
 * Other projects use clearly marked sample figures.
 */
(function (global) {
  const FX = { PKR: 1, GBP: 365, USD: 278, AUD: 185, EUR: 305 };
  const FX_LABEL = { PKR: "Rs", GBP: "£", USD: "$", AUD: "A$", EUR: "€" };

  function esc(str) {
    return String(str == null ? "" : str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function schedule(total, months) {
    return {
      total: total,
      down: Math.round(total * 0.175),
      confirm: Math.round(total * 0.175),
      monthly: Math.round(total * 0.01),
      half: Math.round(total * 0.04),
      possession: Math.round(total * 0.05),
      months: months
    };
  }

  function unitSchedule(unit, rate, months) {
    return schedule(unit.area * rate, months);
  }

  function formatFull(pkr, code) {
    const cur = code || "PKR";
    const n = pkr / FX[cur];
    if (cur === "PKR") return Math.round(n).toLocaleString("en-PK");
    return n.toLocaleString("en-US", { maximumFractionDigits: 0 });
  }

  function formatShort(pkr, code) {
    const cur = code || "PKR";
    const prefix = FX_LABEL[cur] + " ";
    if (cur !== "PKR") return prefix + formatFull(pkr, cur);
    if (pkr >= 10000000) {
      const cr = pkr / 10000000;
      return prefix + (Number.isInteger(cr) ? cr : cr.toFixed(2)) + " Cr";
    }
    const lacs = pkr / 100000;
    return prefix + (Number.isInteger(lacs) ? lacs : lacs.toFixed(1)) + " Lacs";
  }

  function dummyDossier(project) {
    const rate = 12500;
    const months = 36;
    return {
      sample: true,
      copy: project.overview,
      caption: project.name + " — " + (project.shot || "Exterior"),
      imageKind: "Photo",
      stats: [
        { label: "Status", value: project.status },
        { label: "Type", value: project.type || "—" },
        { label: "Location", value: project.location }
      ],
      rate: rate,
      months: months,
      units: [
        {
          id: "a",
          name: "Studio",
          area: 400,
          blurb: "Sample studio plate — confirm sizes and the written schedule at booking.",
          hero: project.image,
          plan: project.image,
          gallery: (project.gallery || [{ src: project.image, alt: project.name }]).slice(0, 3)
        },
        {
          id: "b",
          name: "1 Bed",
          area: 550,
          blurb: "Sample one-bed plate — confirm sizes and the written schedule at booking.",
          hero: (project.gallery && project.gallery[1] && project.gallery[1].src) || project.image,
          plan: project.image,
          gallery: (project.gallery || [{ src: project.image, alt: project.name }]).slice(0, 3)
        },
        {
          id: "c",
          name: "2 Bed",
          area: 850,
          blurb: "Sample two-bed plate — confirm sizes and the written schedule at booking.",
          hero: (project.gallery && project.gallery[2] && project.gallery[2].src) || project.image,
          plan: project.image,
          gallery: (project.gallery || [{ src: project.image, alt: project.name }]).slice(0, 3)
        }
      ],
      floors: [
        {
          id: "typical",
          name: "Typical floor",
          desc: "Sample floor plate. Ask RealTek for the issued drawings for " + project.name + ".",
          units: "On request",
          sizes: "On request",
          rate: null,
          use: project.type || "Mixed use",
          image: project.image
        }
      ],
      amenityShots: [
        { src: project.image, alt: project.name },
        { src: "images/dummy-night.jpg", alt: "Sample night elevation" },
        { src: "images/dummy-terrace.jpg", alt: "Sample terrace" },
        { src: "images/dummy-facade.jpg", alt: "Sample facade" }
      ],
      amenityGroups: [],
      updates: [
        {
          title: project.status,
          note: project.timeline || project.completion || "",
          body: project.overview
        }
      ],
      faqs: [
        {
          q: "Are these prices final?",
          a: "No. Figures on this page for " + project.name + " are samples so you can see the layout. WhatsApp for the issued schedule."
        },
        {
          q: "How do I visit?",
          a: "Call or WhatsApp 0312 4455477. Address: " + (project.address || project.location) + "."
        }
      ],
      mapsQuery: project.address || project.location
    };
  }

  function navHtml(isMall) {
    const links = [
      ["overview", "Overview"],
      ["residences", "Residences & Plans"],
      ["commercial", "Commercial"],
      ["plans", "Payment"],
      ["amenities", "Amenities"],
      ["location", "Location"],
      ["updates", "Updates"],
      ["faqs", "FAQs"]
    ];
    if (!isMall) {
      links.splice(2, 1);
    }
    return (
      '<nav class="dossier-nav" aria-label="On this page"><div class="dossier-nav-inner">' +
      links
        .map(
          (l, i) =>
            '<a href="#' +
            l[0] +
            '"' +
            (i === 0 ? ' class="is-active"' : "") +
            ">" +
            esc(l[1]) +
            "</a>"
        )
        .join("") +
      "</div></nav>"
    );
  }

  function unitCard(unit, rate, months, sample) {
    const pay = unitSchedule(unit, rate, months);
    const n = (unit.gallery || []).length;
    const galBtns = (unit.gallery || [])
      .map(function (img, i) {
        return (
          '<button type="button" class="' +
          (i === 0 ? "unit-act" : "visually-hidden") +
          '" data-lightbox data-lightbox-group="gal-' +
          esc(unit.id) +
          '" data-src="' +
          esc(img.src) +
          '" data-alt="' +
          esc(img.alt) +
          '"' +
          (i === 0 ? "" : ' tabindex="-1" aria-hidden="true"') +
          ">" +
          (i === 0
            ? '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="8" cy="10" r="1.4"/><path d="M3 16l5-5 4 4 3-3 6 6" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>Gallery'
            : "") +
          "</button>"
        );
      })
      .join("");

    return (
      '<article class="unit-card" data-unit="' +
      esc(unit.id) +
      '">' +
      '<div class="unit-card-media">' +
      '<img src="' +
      esc(unit.hero) +
      '" alt="' +
      esc(unit.name) +
      '" loading="lazy">' +
      '<span class="unit-card-count">' +
      n +
      " render" +
      (n === 1 ? "" : "s") +
      "</span></div>" +
      '<div class="unit-card-body">' +
      '<div class="unit-card-head"><h3>' +
      esc(unit.name) +
      "</h3><p>~" +
      unit.area +
      " sq. ft.</p></div>" +
      '<p class="unit-card-price" data-pkr="' +
      pay.total +
      '">' +
      formatShort(pay.total, "PKR") +
      "</p>" +
      '<p class="unit-card-sub">' +
      (sample ? "sample total" : "total price") +
      "</p>" +
      '<dl class="unit-card-pay"><div><dt>Down</dt><dd data-pkr="' +
      pay.down +
      '">' +
      FX_LABEL.PKR +
      " " +
      formatFull(pay.down, "PKR") +
      "</dd></div><div><dt>Monthly</dt><dd><span data-keep>" +
      pay.months +
      " × </span><span data-pkr=\"" +
      pay.monthly +
      '">' +
      FX_LABEL.PKR +
      " " +
      formatFull(pay.monthly, "PKR") +
      "</span></dd></div></dl>" +
      "<p>" +
      esc(unit.blurb) +
      "</p></div>" +
      '<div class="unit-card-acts">' +
      galBtns +
      '<button type="button" class="unit-act" data-lightbox data-lightbox-group="plan-' +
      esc(unit.id) +
      '" data-src="' +
      esc(unit.plan) +
      '" data-alt="' +
      esc(unit.name) +
      ' floor plan">' +
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h7v7H4zM13 4h7v4h-7zM13 10h7v10h-7zM4 13h7v7H4z" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>Floor plan</button>' +
      '<a class="unit-act" href="#plans">' +
      '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="6" width="18" height="13" rx="2" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M7 10h10M7 14h6" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>Payment plan</a>' +
      "</div></article>"
    );
  }

  function floorPanel(floor, i) {
    const rateVal = floor.rate
      ? "Rs " + floor.rate.toLocaleString("en-PK") + " / sq. ft."
      : "—";
    const fromVal = floor.rate ? "On request" : "—";
    return (
      '<article class="floor-split' +
      (i === 0 ? " is-active" : "") +
      '" data-floor-panel="' +
      esc(floor.id) +
      '">' +
      '<div class="floor-copy"><h3>' +
      esc(floor.name) +
      "</h3><p>" +
      esc(floor.desc) +
      '</p><div class="floor-spec">' +
      "<div><span>Units</span><strong>" +
      esc(floor.units) +
      "</strong></div>" +
      "<div><span>Sizes</span><strong>" +
      esc(floor.sizes) +
      "</strong></div>" +
      "<div><span>Rate</span><strong>" +
      esc(rateVal) +
      "</strong></div>" +
      "<div><span>From</span><strong>" +
      esc(fromVal) +
      "</strong></div></div></div>" +
      '<figure class="floor-plan"><button type="button" data-lightbox data-lightbox-group="floor-' +
      esc(floor.id) +
      '" data-src="' +
      esc(floor.image) +
      '" data-alt="' +
      esc(floor.name) +
      ' floor plan"><img src="' +
      esc(floor.image) +
      '" alt="' +
      esc(floor.name) +
      ' floor plan" loading="lazy"></button>' +
      "<figcaption>Click to enlarge the blueprint</figcaption></figure></article>"
    );
  }

  function paymentTable(units, rate, months, sample, projectName) {
    const rows = [
      ["Total price", "total", true],
      ["Down payment", "down", false, "At booking · 17.5%"],
      ["Confirmation", "confirm", false, "17.5%"],
      ["Monthly instalment", "monthly", false, "× " + months + " · 1%"],
      ["Half-yearly", "half", false, "× 6 · 4%"],
      ["At possession", "possession", false, "5%"]
    ];
    const head =
      '<div class="pay-table" style="--cols: ' +
      units.length +
      '" data-pay-table><div class="pay-row pay-head"><span>Payment</span>' +
      units
        .map(function (u) {
          return "<span>" + esc(u.name) + "<small>~" + u.area + " sq. ft.</small></span>";
        })
        .join("") +
      "</div>";
    const body = rows
      .map(function (row) {
        return (
          '<div class="pay-row' +
          (row[2] ? " is-total" : "") +
          '"><span>' +
          esc(row[0]) +
          (row[3] ? "<small>" + esc(row[3]) + "</small>" : "") +
          "</span>" +
          units
            .map(function (u) {
              const pay = unitSchedule(u, rate, months);
              const val = pay[row[1]];
              return '<span data-pkr="' + val + '">' + formatFull(val, "PKR") + "</span>";
            })
            .join("") +
          "</div>"
        );
      })
      .join("");
    const cta =
      '<div class="pay-row pay-cta"><span></span>' +
      units
        .map(function (u) {
          return (
            '<span><a href="' +
            esc(
              global.RT.whatsappHref
                ? RT.whatsappHref(
                    "Hi, I would like the full payment schedule for a " +
                      u.name +
                      " at " +
                      (projectName || "Madina Mall & Residency") +
                      "."
                  )
                : "https://wa.me/923124455477"
            ) +
            '" target="_blank" rel="noopener noreferrer">Full schedule →</a></span>'
          );
        })
        .join("") +
      "</div></div>";
    return (
      head +
      body +
      cta +
      '<p class="pay-foot"' +
      (sample ? ' data-base="sample"' : "") +
      ">" +
      (sample
        ? "Sample figures for layout only · confirm the issued schedule at booking."
        : "All figures in PKR · 1% construction-linked plan · areas approx and gross · schedules issued in writing at booking.") +
      "</p>"
    );
  }

  function render(project) {
    const isMall = project.id === "upcoming" && project.dossier;
    const d = isMall ? project.dossier : dummyDossier(project);
    return build(project, d, isMall, d.rate, d.months, d.hero || project.image);
  }

  function build(project, d, isMall, rate, months, img) {
    const sample = !!d.sample;
    const currencies = ["PKR", "GBP", "USD", "AUD", "EUR"]
      .map(function (c) {
        return (
          '<button type="button" class="fx-btn' +
          (c === "PKR" ? " is-active" : "") +
          '" data-fx="' +
          c +
          '">' +
          c +
          "</button>"
        );
      })
      .join("");

    const stats = d.stats
      .map(function (s) {
        return (
          "<div><span>" + esc(s.label) + "</span><strong>" + esc(s.value) + "</strong></div>"
        );
      })
      .join("");

    const floorTabs = d.floors
      .map(function (f, i) {
        return (
          '<button type="button" class="floor-tab' +
          (i === 0 ? " is-active" : "") +
          '" data-floor="' +
          esc(f.id) +
          '">' +
          esc(f.name) +
          "</button>"
        );
      })
      .join("");

    const amenityPhotos = (d.amenityShots || [])
      .map(function (s) {
        return (
          '<button type="button" data-lightbox data-lightbox-group="amenities" data-src="' +
          esc(s.src) +
          '" data-alt="' +
          esc(s.alt) +
          '"><img src="' +
          esc(s.src) +
          '" alt="' +
          esc(s.alt) +
          '" loading="lazy"></button>'
        );
      })
      .join("");

    const groups = project.amenityGroups || [];
    const amenityLists = groups
      .map(function (g) {
        return (
          "<div><h3>" +
          esc(g.label) +
          "</h3><ul>" +
          g.items.map(function (item) {
            return "<li>" + esc(item) + "</li>";
          }).join("") +
          "</ul></div>"
        );
      })
      .join("");

    const updates = (d.updates || [])
      .map(function (u) {
        return (
          "<article><p class=\"dossier-kicker\">" +
          esc(u.note || "") +
          "</p><h3>" +
          esc(u.title) +
          "</h3><p>" +
          esc(u.body) +
          "</p></article>"
        );
      })
      .join("");

    const faqs = (d.faqs || [])
      .map(function (f) {
        return (
          "<details><summary>" +
          esc(f.q) +
          "</summary><p>" +
          esc(f.a) +
          "</p></details>"
        );
      })
      .join("");

    const maps = encodeURIComponent(d.mapsQuery || project.location);

    const locSrc = d.locImage || d.hero || project.image;

    return (
      navHtml(isMall) +
      (sample
        ? '<p class="dossier-banner wrap">Sample figures for this page — not a published RealTek schedule. WhatsApp for issued drawings.</p>'
        : "") +
      '<section class="dossier-block" id="overview">' +
      '<div class="wrap dossier-split">' +
      "<div><p class=\"dossier-kicker\"><i></i>01 — Overview</p>" +
      '<p class="dossier-copy">' +
      esc(d.copy) +
      "</p></div>" +
      "<figure><img src=\"" +
      esc(img) +
      '" alt="' +
      esc(d.caption) +
      '"><figcaption><span>' +
      esc(d.caption) +
      "</span><span>" +
      esc(d.imageKind) +
      "</span></figcaption></figure></div>" +
      '<div class="dossier-stats">' +
      stats +
      "</div></section>" +
      '<section class="dossier-block" id="residences">' +
      '<div class="wrap"><p class="dossier-kicker"><i></i>02 — Residences &amp; plans</p>' +
      "<h2 class=\"display display-emphasis\">" +
      (isMall ? "Three ways in." : "Sample plates.") +
      "</h2>" +
      (sample
        ? "<p class=\"dossier-note\">Dummy layouts for this project — WhatsApp for issued drawings.</p>"
        : "<p class=\"dossier-note\">Each plate has its own blueprint. Areas are approximate and gross. Three-bed drawings are shared at booking.</p>") +
      '<div class="unit-grid">' +
      d.units.map(function (u) {
        return unitCard(u, rate, months, sample);
      }).join("") +
      "</div></div></section>" +
      (isMall
        ? '<section class="dossier-block" id="commercial"><div class="wrap"><p class="dossier-kicker"><i></i>03 — Commercial</p>' +
          '<h2 class="display display-emphasis">Retail, floor by floor.</h2>' +
          '<div class="floor-tabs" role="tablist">' +
          floorTabs +
          "</div>" +
          d.floors.map(floorPanel).join("") +
          "</div></section>"
        : "") +
      '<section class="dossier-block" id="plans">' +
      '<div class="wrap"><div class="pay-head-row">' +
      "<div><p class=\"dossier-kicker\"><i></i>" +
      (isMall ? "04" : "03") +
      " — Payment</p>" +
      "<h2>Payment plans, side by side</h2></div>" +
      '<div class="pay-tools"><p>3 years · 1% plan</p><div class="fx-row" role="group" aria-label="Currency">' +
      currencies +
      "</div></div></div>" +
      paymentTable(d.units, rate, months, sample, project.name) +
      (isMall
        ? (project.paymentPlans || [])
            .map(function (plan) {
              return (
                '<div class="table-wrap pay-commercial"><p class="eyebrow">' +
                esc(plan.title) +
                (plan.note ? " · " + esc(plan.note) : "") +
                "</p><table><thead><tr><th>Type</th><th>Per sq. ft.</th><th>Booking</th><th>Confirm</th><th>Monthly</th><th>Half-yearly</th><th>Possession</th></tr></thead><tbody>" +
                plan.rows
                  .map(function (r) {
                    return (
                      "<tr>" +
                      r
                        .map(function (c) {
                          return "<td>" + esc(c) + "</td>";
                        })
                        .join("") +
                      "</tr>"
                    );
                  })
                  .join("") +
                "</tbody></table></div>"
              );
            })
            .join("") +
          '<ul class="plan-notes">' +
          (project.paymentNotes || [])
            .map(function (n) {
              return "<li>" + esc(n) + "</li>";
            })
            .join("") +
          "</ul>"
        : "") +
      "</div></section>" +
      '<section class="dossier-block" id="amenities">' +
      '<div class="wrap"><p class="dossier-kicker"><i></i>' +
      (isMall ? "05" : "04") +
      " — Amenities</p>" +
      '<h2 class="display display-emphasis">' +
      (isMall ? "Built in, not bolted on." : "On the record.") +
      "</h2>" +
      '<div class="amenity-shots">' +
      amenityPhotos +
      "</div>" +
      (amenityLists ? '<div class="amenity-cols">' + amenityLists + "</div>" : "") +
      "</div></section>" +
      '<section class="dossier-block" id="location">' +
      '<div class="wrap dossier-split"><div><p class="dossier-kicker"><i></i>' +
      (isMall ? "06" : "05") +
      " — Location</p>" +
      '<h2 class="display display-emphasis">' +
      esc(project.location) +
      "</h2><p>" +
      esc(project.address || project.location) +
      '</p><a class="btn btn-outline" href="https://www.google.com/maps/search/?api=1&query=' +
      maps +
      '" target="_blank" rel="noopener noreferrer">Get directions</a></div>' +
      '<figure><img src="' +
      esc(locSrc) +
      '" alt="' +
      esc(project.name) +
      ", " +
      esc(project.location) +
      '" loading="lazy"><figcaption><span>' +
      esc(project.name) +
      "</span><span>Site</span></figcaption></figure></div></section>" +
      '<section class="dossier-block" id="updates">' +
      '<div class="wrap"><p class="dossier-kicker"><i></i>' +
      (isMall ? "07" : "06") +
      " — Updates</p>" +
      '<div class="update-list">' +
      updates +
      "</div></div></section>" +
      '<section class="dossier-block" id="faqs">' +
      '<div class="wrap"><p class="dossier-kicker"><i></i>' +
      (isMall ? "08" : "07") +
      " — FAQs</p>" +
      '<div class="faq-list">' +
      faqs +
      "</div></div></section>"
    );
  }

  function applyFx(root, code) {
    root.querySelectorAll("[data-pkr]").forEach(function (el) {
      const pkr = Number(el.getAttribute("data-pkr"));
      if (!pkr) return;
      const short = el.classList.contains("unit-card-price");
      const inTable = el.closest(".pay-table");
      if (short) el.textContent = formatShort(pkr, code);
      else if (inTable) {
        el.textContent =
          (code === "PKR" ? "" : FX_LABEL[code] + " ") + formatFull(pkr, code);
      } else {
        el.textContent = FX_LABEL[code] + " " + formatFull(pkr, code);
      }
    });
    const foot = root.querySelector(".pay-foot");
    if (!foot || foot.dataset.base === "sample") return;
    if (code !== "PKR") {
      foot.textContent =
        "Indicative " +
        code +
        " for overseas viewing · schedules issued in PKR · construction-linked, never rate-linked.";
    } else {
      foot.textContent =
        "All figures in PKR · 1% construction-linked plan · areas approx and gross · schedules issued in writing at booking.";
    }
  }

  function bind(root) {
    const tabs = root.querySelectorAll("[data-floor]");
    const panels = root.querySelectorAll("[data-floor-panel]");
    tabs.forEach(function (btn) {
      btn.addEventListener("click", function () {
        const id = btn.getAttribute("data-floor");
        tabs.forEach(function (t) {
          t.classList.toggle("is-active", t === btn);
        });
        panels.forEach(function (p) {
          p.classList.toggle("is-active", p.getAttribute("data-floor-panel") === id);
        });
      });
    });

    root.querySelectorAll(".unit-card-media").forEach(function (media) {
      media.addEventListener("click", function () {
        const card = media.closest(".unit-card");
        const btn = card && card.querySelector(".unit-card-acts [data-lightbox]");
        if (btn) btn.click();
      });
    });

    const fxBtns = root.querySelectorAll("[data-fx]");
    fxBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        fxBtns.forEach(function (b) {
          b.classList.toggle("is-active", b === btn);
        });
        applyFx(root, btn.getAttribute("data-fx"));
      });
    });

    root.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener("click", function (e) {
        const id = (a.getAttribute("href") || "").slice(1);
        const sec = document.getElementById(id);
        if (!sec) return;
        e.preventDefault();
        const nav = root.querySelector(".dossier-nav");
        const header = document.getElementById("header");
        const offset = -((header ? header.offsetHeight : 72) + (nav ? nav.offsetHeight : 48) + 8);
        const lenis = global.RT && RT.lenis;
        if (lenis && typeof lenis.scrollTo === "function") {
          lenis.scrollTo(sec, { offset: offset });
        } else {
          sec.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    });

    const links = root.querySelectorAll(".dossier-nav a");
    const sections = [];
    links.forEach(function (a) {
      const id = (a.getAttribute("href") || "").slice(1);
      const sec = document.getElementById(id);
      if (sec) sections.push({ a: a, sec: sec });
    });
    if (sections.length && "IntersectionObserver" in window) {
      const io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            links.forEach(function (a) {
              a.classList.toggle("is-active", a.getAttribute("href") === "#" + entry.target.id);
            });
          });
        },
        { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
      );
      sections.forEach(function (s) {
        io.observe(s.sec);
      });
    }
  }

  function mount(project, host) {
    if (!host || !project) return;
    document.body.classList.add("is-dossier");
    host.innerHTML = render(project);
    bind(host);
    if (global.RT && typeof RT.initLightbox === "function") RT.initLightbox();
  }

  global.RT = global.RT || {};
  global.RT.mountDossier = mount;
})(window);
