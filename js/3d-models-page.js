/**
 * /3d-models/ — inline (non-modal) 3D models page.
 * Reuses the same model config as js/models-3d.js but mounts the
 * picker + <model-viewer> stage directly in the page.
 */
(function () {
  // Copied from js/models-3d.js — keep in sync if models change.
  var MODELS = [
    { id: "studio", name: "Studio Apartment", src: "/images/models/studio-apartment.glb" },
    { id: "1bed", name: "1 Bed Apartment", src: "/images/models/1-bed-apartment.glb" },
    { id: "2bed", name: "2 Bed Apartment", src: "/images/models/2-bed-apartment.glb" }
  ];

  var picker = document.querySelector("[data-m3d-picker]");
  var options = document.querySelector("[data-m3d-options]");
  var stageWrap = document.querySelector("[data-m3d-stage-wrap]");
  var stage = document.querySelector("[data-m3d-stage]");
  var titleEl = document.querySelector("[data-m3d-title]");
  var backBtn = document.querySelector("[data-m3d-back]");

  if (!picker || !options || !stageWrap || !stage) return;

  function esc(s) { return String(s).replace(/"/g, ""); }

  options.innerHTML = MODELS.map(function (m) {
    return (
      '<button type="button" class="m3d-option" data-m3d-pick="' + esc(m.id) + '">' +
      '<span class="m3d-option-name">' + m.name + "</span>" +
      '<span class="m3d-option-go">Open in 3D &rarr;</span>' +
      "</button>"
    );
  }).join("");

  options.querySelectorAll("[data-m3d-pick]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      openModel(btn.getAttribute("data-m3d-pick"));
    });
  });

  function openModel(id) {
    var model = null;
    for (var i = 0; i < MODELS.length; i++) {
      if (MODELS[i].id === id) model = MODELS[i];
    }
    if (!model) return;

    titleEl.textContent = model.name;
    stage.innerHTML = "";
    var viewer = document.createElement("model-viewer");
    viewer.setAttribute("src", model.src);
    viewer.setAttribute("alt", model.name + " — RealTek Developers 3D model");
    viewer.setAttribute("camera-controls", "");
    viewer.setAttribute("auto-rotate", "");
    viewer.setAttribute("rotation-per-second", "24deg");
    viewer.setAttribute("shadow-intensity", "1");
    viewer.setAttribute("exposure", "1.05");
    viewer.setAttribute("environment-image", "neutral");
    viewer.setAttribute("reveal", "auto");
    viewer.setAttribute("ar", "");
    stage.appendChild(viewer);

    picker.hidden = true;
    stageWrap.hidden = false;
    stageWrap.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function closeModel() {
    stage.innerHTML = "";
    stageWrap.hidden = true;
    picker.hidden = false;
  }

  if (backBtn) backBtn.addEventListener("click", closeModel);

  // Deep-link support: /3d-models/#studio, #1bed, #2bed
  var hash = (location.hash || "").replace("#", "");
  var match = MODELS.filter(function (m) { return m.id === hash; })[0];
  if (match) openModel(match.id);
})();
