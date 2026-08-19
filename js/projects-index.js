/**
 * Projects index — filter pills, Zee99-style workflow.
 */
(function () {
  document.addEventListener("DOMContentLoaded", () => {
    const root = document.querySelector("[data-folio]");
    if (!root) return;

    const buttons = root.querySelectorAll("[data-filter]");
    const cards = root.querySelectorAll("[data-kind]");
    const empty = root.querySelector("[data-folio-empty]");

    const apply = (kind) => {
      let shown = 0;
      cards.forEach((card) => {
        const match = kind === "all" || card.getAttribute("data-kind") === kind;
        card.classList.toggle("is-hidden", !match);
        if (match) shown += 1;
      });
      if (empty) empty.hidden = shown > 0;
    };

    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const kind = btn.getAttribute("data-filter") || "all";
        buttons.forEach((other) => {
          const on = other === btn;
          other.classList.toggle("is-active", on);
          other.setAttribute("aria-pressed", on ? "true" : "false");
        });
        apply(kind);
      });
    });
  });
})();
