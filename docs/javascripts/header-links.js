/*
 * Adds a "Library Photo Album/Scans" link to the site header (top bar) on
 * every page. Re-runs on each instant navigation via Material's document$.
 */
(function () {
  var URL =
    "https://photos.google.com/share/AF1QipPZh0VSw9xNnSlLXymxUNTLKFUZMe3jHexgGj0MWOzPgkbCXOxvT4X256yFpPueDQ?key=SjQzRnZOVUh0UUhxQy1YV2d2aDNFek41TWo2RUJ3";

  function setup() {
    var inner = document.querySelector(".md-header__inner");
    if (!inner || inner.querySelector(".md-header__photolink")) return;

    var a = document.createElement("a");
    a.className = "md-header__photolink";
    a.href = URL;
    a.target = "_blank";
    a.rel = "noopener";
    a.title = "Library Photo Album / Scans";
    a.innerHTML =
      '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">' +
      '<path fill="currentColor" d="M21 19V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2M8.5 13.5l2.5 3.01L14.5 12l4.5 6H5z"/>' +
      "</svg><span>Library Photo Album/Scans</span>";

    var search = inner.querySelector(".md-search");
    if (search) inner.insertBefore(a, search);
    else inner.appendChild(a);
  }

  if (window.document$ && typeof window.document$.subscribe === "function") {
    window.document$.subscribe(setup);
  } else {
    document.addEventListener("DOMContentLoaded", setup);
  }
})();
