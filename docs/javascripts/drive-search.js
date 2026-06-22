/*
 * Adds a "Search the Library Drive instead" checkbox to the top of the main
 * search dropdown. When checked, pressing Enter in the search box opens Google
 * Drive search scoped to the library folder (instead of the wiki search), and
 * the local wiki results are hidden.
 */
(function () {
  var FOLDER = "1VlywV-4QWgV_UgFvXyYZmKwtyBtH705x";

  function driveURL(q) {
    return "https://drive.google.com/drive/search?q=" +
      encodeURIComponent(q.trim()) + "%20parent:" + FOLDER;
  }

  function setup() {
    var root = document.querySelector(".md-search");
    var inner = document.querySelector(".md-search__inner");
    var input = document.querySelector(".md-search__input");
    var output = inner && inner.querySelector(".md-search__output");
    if (!root || !input || !output || output.querySelector(".drive-toggle")) return;

    var label = document.createElement("label");
    label.className = "drive-toggle";
    label.innerHTML =
      '<input type="checkbox"> ' +
      "<span>Search the Library Drive instead <em>(press Enter)</em></span>";
    output.insertBefore(label, output.firstChild);

    var cb = label.querySelector("input");
    var localPlaceholder = input.getAttribute("placeholder") || "Search";

    cb.addEventListener("change", function () {
      root.classList.toggle("drive-mode", cb.checked);
      input.setAttribute(
        "placeholder",
        cb.checked ? "Search the Library Drive…" : localPlaceholder
      );
    });

    // Capture phase so this runs before Material's own Enter handler.
    input.addEventListener(
      "keydown",
      function (e) {
        if (cb.checked && (e.key === "Enter" || e.keyCode === 13)) {
          e.preventDefault();
          e.stopPropagation();
          var q = input.value;
          if (q.trim()) window.open(driveURL(q), "_blank", "noopener");
        }
      },
      true
    );
  }

  // Re-run on every (instant) navigation if Material's document$ is available.
  if (window.document$ && typeof window.document$.subscribe === "function") {
    window.document$.subscribe(setup);
  } else {
    document.addEventListener("DOMContentLoaded", setup);
  }
})();
