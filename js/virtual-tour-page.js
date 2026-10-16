/**
 * /virtual-tour/ — inline (non-modal) virtual tour page.
 * Reuses the same Panoee tour config as js/projects.js (HEIGHTS4_TOURS)
 * but mounts the picker + 360° iframe directly in the page.
 */
(function () {
  // Copied from js/projects.js — keep in sync if tour URLs change.
  var TOURS = [
    { id: "studio", name: "Studio Apartment", panoee: "https://tour.panoee.net/6aa34a9c09ac3e7ed6a5dc82" },
    { id: "1bed", name: "1 Bed Apartment", panoee: "https://tour.panoee.net/6aa3482f09ac3ea980a5dc3b" },
    { id: "2bed", name: "2 Bed Apartment", panoee: "https://tour.panoee.net/6aa1b7b809ac3e094ba5abc9" }
  ];

  var picker = document.querySelector("[data-vt-picker]");
  var options = document.querySelector("[data-vt-options]");
  var stage = document.querySelector("[data-vt-stage]");
  var titleEl = document.querySelector("[data-vt-title]");
  var frame = document.querySelector("[data-vt-frame]");
  var backBtn = document.querySelector("[data-vt-back]");

  if (!picker || !options || !stage || !frame) return;

  function esc(s) { return String(s).replace(/"/g, ""); }

  options.innerHTML = TOURS.map(function (t) {
    return (
      '<button type="button" class="vt-option" data-vt-pick="' + esc(t.panoee) + '" data-vt-pick-name="' + esc(t.name) + '">' +
      '<span class="vt-option-name">' + t.name + "</span>" +
      '<span class="vt-option-go">Start 360&deg; tour &rarr;</span>' +
      "</button>"
    );
  }).join("");

  options.querySelectorAll("[data-vt-pick]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      openTour(btn.getAttribute("data-vt-pick"), btn.getAttribute("data-vt-pick-name"));
    });
  });

  function openTour(url, name) {
    titleEl.textContent = name + " — 360° tour";
    frame.src = url;
    picker.hidden = true;
    stage.hidden = false;
    stage.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function closeTour() {
    frame.src = "about:blank";
    stage.hidden = true;
    picker.hidden = false;
  }

  if (backBtn) backBtn.addEventListener("click", closeTour);

  // Deep-link support: /virtual-tour/#studio, #1bed, #2bed
  var hash = (location.hash || "").replace("#", "");
  var match = TOURS.filter(function (t) { return t.id === hash; })[0];
  if (match) openTour(match.panoee, match.name);
})();
