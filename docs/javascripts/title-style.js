/*
 * Wraps the leading "The" of the header site title in a span so it can be
 * rendered slightly smaller than the rest. Re-runs on each instant navigation.
 */
(function () {
  function setup() {
    var el =
      document.querySelector(
        ".md-header__ellipsis .md-header__topic:first-child > .md-ellipsis"
      ) || document.querySelector(".md-header__topic > .md-ellipsis");
    if (!el || el.querySelector(".title-the")) return;
    el.innerHTML = el.innerHTML.replace(
      /^(\s*)(The)(\s)/,
      '$1<span class="title-the">$2</span>$3'
    );
  }

  if (window.document$ && typeof window.document$.subscribe === "function") {
    window.document$.subscribe(setup);
  } else {
    document.addEventListener("DOMContentLoaded", setup);
  }
})();
