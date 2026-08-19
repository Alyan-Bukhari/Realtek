/**
 * Apartment tour — floor-plan hotspots + room viewer.
 * Config shape: { plan, photos: [{src,alt}], hotspots: [{id,label,top,left,start}] }
 */
(function (global) {
  let kenBurns = null;
  let photos = [];
  let index = 0;
  let title = "";

  function $(sel, root) {
    return (root || document).querySelector(sel);
  }

  function ensure() {
    if ($("#apt-tour")) return $("#apt-tour");
    const wrap = document.createElement("div");
    wrap.id = "apt-tour";
    wrap.className = "apt-tour";
    wrap.hidden = true;
    wrap.setAttribute("role", "dialog");
    wrap.setAttribute("aria-modal", "true");
    wrap.setAttribute("aria-label", "Apartment tour");
    wrap.innerHTML =
      '<button class="apt-tour-close" type="button" data-tour-close aria-label="Close tour">×</button>' +
      '<div class="apt-tour-plan" data-tour-plan>' +
      '<p class="apt-tour-kicker">Floor plan</p>' +
      '<h2 data-tour-title></h2>' +
      '<p class="apt-tour-hint">Tap a marker to open that room.</p>' +
      '<div class="apt-tour-stage"><img data-tour-plan-img alt=""><div data-tour-spots></div></div>' +
      '<div class="apt-tour-rooms" data-tour-rooms></div>' +
      "</div>" +
      '<div class="apt-tour-room" data-tour-room hidden>' +
      '<button class="apt-tour-back" type="button" data-tour-back>← Back to floor plan</button>' +
      '<figure class="apt-tour-figure"><img data-tour-room-img alt=""></figure>' +
      '<div class="apt-tour-bar">' +
      '<button type="button" data-tour-prev aria-label="Previous photo">←</button>' +
      '<p data-tour-count>1 / 1</p>' +
      '<button type="button" data-tour-next aria-label="Next photo">→</button>' +
      "</div>" +
      '<div class="apt-tour-thumbs" data-tour-thumbs></div>' +
      "</div>";
    document.body.appendChild(wrap);

    wrap.addEventListener("click", function (e) {
      if (e.target === wrap || e.target.closest("[data-tour-close]")) close();
    });
    wrap.querySelector("[data-tour-back]").addEventListener("click", showPlan);
    wrap.querySelector("[data-tour-prev]").addEventListener("click", function () {
      showPhoto(index - 1);
    });
    wrap.querySelector("[data-tour-next]").addEventListener("click", function () {
      showPhoto(index + 1);
    });
    document.addEventListener("keydown", function (e) {
      if (wrap.hidden) return;
      if (e.key === "Escape") close();
      const room = wrap.querySelector("[data-tour-room]");
      if (room.hidden) return;
      if (e.key === "ArrowLeft") showPhoto(index - 1);
      if (e.key === "ArrowRight") showPhoto(index + 1);
    });
    return wrap;
  }

  function stopKenBurns() {
    if (kenBurns && typeof kenBurns.kill === "function") kenBurns.kill();
    kenBurns = null;
  }

  function showPlan() {
    const root = ensure();
    root.querySelector("[data-tour-plan]").hidden = false;
    root.querySelector("[data-tour-room]").hidden = true;
    stopKenBurns();
  }

  function showPhoto(i) {
    if (!photos.length) return;
    index = (i + photos.length) % photos.length;
    const item = photos[index];
    const img = $("[data-tour-room-img]");
    const count = $("[data-tour-count]");
    const root = ensure();
    root.querySelector("[data-tour-plan]").hidden = true;
    const room = root.querySelector("[data-tour-room]");
    room.hidden = false;
    img.src = item.src;
    img.alt = item.alt || title;
    if (count) count.textContent = index + 1 + " / " + photos.length;
    root.querySelectorAll("[data-tour-thumbs] button").forEach(function (btn, n) {
      btn.classList.toggle("is-active", n === index);
    });
    stopKenBurns();
    img.style.transform = "scale(1)";
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduce && global.gsap) {
      kenBurns = gsap.fromTo(
        img,
        { scale: 1 },
        { scale: 1.06, duration: 7, ease: "none" }
      );
    }
  }

  function open(config, name) {
    if (!config || !config.plan) return;
    photos = config.photos || [];
    title = name || "Apartment";
    const root = ensure();
    $("[data-tour-title]", root).textContent = title;
    const planImg = $("[data-tour-plan-img]", root);
    planImg.src = config.plan;
    planImg.alt = title + " floor plan";
    const spots = $("[data-tour-spots]", root);
    const rooms = $("[data-tour-rooms]", root);
    const thumbs = $("[data-tour-thumbs]", root);
    spots.innerHTML = (config.hotspots || [])
      .map(function (h) {
        return (
          '<button type="button" class="apt-hotspot" style="top:' +
          h.top +
          ";left:" +
          h.left +
          '" data-start="' +
          (h.start || 0) +
          '" aria-label="' +
          h.label +
          '"><span>' +
          h.label +
          "</span></button>"
        );
      })
      .join("");
    rooms.innerHTML = (config.hotspots || [])
      .map(function (h) {
        return (
          '<button type="button" data-start="' +
          (h.start || 0) +
          '">' +
          h.label +
          "</button>"
        );
      })
      .join("");
    thumbs.innerHTML = photos
      .map(function (p, i) {
        return (
          '<button type="button" data-start="' +
          i +
          '"><img src="' +
          p.src +
          '" alt=""></button>'
        );
      })
      .join("");

    function bindStarts(sel) {
      root.querySelectorAll(sel).forEach(function (btn) {
        btn.addEventListener("click", function () {
          showPhoto(Number(btn.getAttribute("data-start") || 0));
        });
      });
    }
    bindStarts("[data-tour-spots] [data-start]");
    bindStarts("[data-tour-rooms] [data-start]");
    bindStarts("[data-tour-thumbs] [data-start]");

    showPlan();
    root.hidden = false;
    document.body.style.overflow = "hidden";
    if (global.RT && RT.lenis && typeof RT.lenis.stop === "function") RT.lenis.stop();
    const closeBtn = $("[data-tour-close]", root);
    if (closeBtn) closeBtn.focus();
  }

  function close() {
    const root = $("#apt-tour");
    if (!root) return;
    root.hidden = true;
    document.body.style.overflow = "";
    stopKenBurns();
    if (global.RT && RT.lenis && typeof RT.lenis.start === "function") RT.lenis.start();
  }

  global.RT = global.RT || {};
  global.RT.openTour = open;
  global.RT.closeTour = close;
})(window);
