/*
 * Keep the "Primary Sources & Documents" section expanded by default in the
 * left navigation, even when the current page is elsewhere. Re-runs on each
 * instant navigation via Material's document$.
 */
(function () {
  function expand() {
    var sidebar = document.querySelector(".md-sidebar--primary");
    if (!sidebar) return;

    var link = sidebar.querySelector(
      'a[href$="/primary-sources-and-documents/"], a[href$="primary-sources-and-documents/"]'
    );
    var item = link && link.closest(".md-nav__item--nested");

    if (!item) {
      // Fallback: match the section by its label text.
      var labels = sidebar.querySelectorAll(
        ".md-nav__item--nested > label, .md-nav__item--nested > .md-nav__link"
      );
      for (var i = 0; i < labels.length; i++) {
        if (/Primary Sources & Documents/.test(labels[i].textContent)) {
          item = labels[i].closest(".md-nav__item--nested");
          break;
        }
      }
    }
    if (!item) return;

    var toggle = item.querySelector(":scope > input.md-nav__toggle");
    if (toggle && !toggle.checked) {
      // Apply the default-expanded state without animating: disable
      // transitions, flip the toggle, force a reflow so the expanded layout
      // lands instantly, then restore transitions for later user interaction.
      item.classList.add("md-nav__item--no-anim");
      toggle.checked = true;
      void item.offsetHeight;
      item.classList.remove("md-nav__item--no-anim");
    }
  }

  if (window.document$ && typeof window.document$.subscribe === "function") {
    window.document$.subscribe(expand);
  } else {
    document.addEventListener("DOMContentLoaded", expand);
  }
})();
