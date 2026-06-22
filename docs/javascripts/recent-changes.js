/*
 * Paginates the Recent Changes table: shows 12 rows per page with Prev/Next
 * controls, back to the very first change. Runs only on /recent-changes/.
 */
(function () {
  var PER_PAGE = 12;

  function setup() {
    if (!/\/recent-changes\/?$/.test(location.pathname)) return;
    var table = document.querySelector(".md-content .md-typeset table");
    if (!table || !table.tBodies.length || table.dataset.paged) return;

    var rows = Array.prototype.slice.call(table.tBodies[0].rows);
    var pages = Math.ceil(rows.length / PER_PAGE);
    if (pages <= 1) return;
    table.dataset.paged = "1";

    var page = 0;

    var pager = document.createElement("nav");
    pager.className = "rc-pager";
    var prev = document.createElement("button");
    prev.type = "button";
    prev.textContent = "‹ Newer";
    var label = document.createElement("span");
    label.className = "rc-pager__label";
    var next = document.createElement("button");
    next.type = "button";
    next.textContent = "Older ›";
    pager.appendChild(prev);
    pager.appendChild(label);
    pager.appendChild(next);
    table.parentNode.insertBefore(pager, table.nextSibling);

    function render(scroll) {
      var start = page * PER_PAGE;
      var end = start + PER_PAGE;
      rows.forEach(function (r, i) {
        r.style.display = i >= start && i < end ? "" : "none";
      });
      label.textContent = "Page " + (page + 1) + " of " + pages;
      prev.disabled = page === 0;
      next.disabled = page === pages - 1;
      if (scroll) table.scrollIntoView({ block: "start", behavior: "smooth" });
    }

    prev.addEventListener("click", function () {
      if (page > 0) { page--; render(true); }
    });
    next.addEventListener("click", function () {
      if (page < pages - 1) { page++; render(true); }
    });

    render(false);
  }

  if (window.document$ && typeof window.document$.subscribe === "function") {
    window.document$.subscribe(setup);
  } else {
    document.addEventListener("DOMContentLoaded", setup);
  }
})();
