/*
 * Adds header (top-bar) links on every page: a "Discord", "GDrive Docs" and
 * "Photo Album/Scans" link, in that order, just left of the search box.
 * Re-runs on each instant navigation via Material's document$.
 */
(function () {
  var DISCORD_URL =
    "https://discord.com/channels/1124879879977046137/1421995545781604462";
  var PHOTO_URL =
    "https://photos.google.com/share/AF1QipPZh0VSw9xNnSlLXymxUNTLKFUZMe3jHexgGj0MWOzPgkbCXOxvT4X256yFpPueDQ?key=SjQzRnZOVUh0UUhxQy1YV2d2aDNFek41TWo2RUJ3";
  var DRIVE_URL =
    "https://drive.google.com/drive/folders/1ijbCSIdNw8ovS7D-P8Z6L6IPu-dcvs44?usp=sharing";

  function makeLink(extraClass, href, title, label, iconPath) {
    var a = document.createElement("a");
    a.className = "md-header__extlink " + extraClass;
    a.href = href;
    a.target = "_blank";
    a.rel = "noopener";
    a.title = title;
    a.innerHTML =
      '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">' +
      '<path fill="currentColor" d="' + iconPath + '"/>' +
      "</svg><span>" + label + "</span>";
    return a;
  }

  function setup() {
    var inner = document.querySelector(".md-header__inner");
    if (!inner || inner.querySelector(".md-header__extlink")) return;

    var discord = makeLink(
      "md-header__discordlink",
      DISCORD_URL,
      "Discord",
      "Discord",
      // Discord logo
      "M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"
    );
    var drive = makeLink(
      "md-header__drivelink",
      DRIVE_URL,
      "GDrive Docs",
      "GDrive Docs",
      // Google Drive triangle glyph
      "M7.71 3.5 1.15 15l3.43 5.5 6.56-11.5zm8.58 0H9.42l6.56 11.5h6.87zm-1.7 13H4.94L1.5 22h13.16l3.43-5.5z"
    );
    var photo = makeLink(
      "md-header__photolink",
      PHOTO_URL,
      "Photo Album / Scans",
      "Photo Album/Scans",
      // Picture/landscape glyph
      "M21 19V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2M8.5 13.5l2.5 3.01L14.5 12l4.5 6H5z"
    );

    var search = inner.querySelector(".md-search");
    if (search) {
      inner.insertBefore(discord, search);
      inner.insertBefore(drive, search);
      inner.insertBefore(photo, search);
    } else {
      inner.appendChild(discord);
      inner.appendChild(drive);
      inner.appendChild(photo);
    }
  }

  if (window.document$ && typeof window.document$.subscribe === "function") {
    window.document$.subscribe(setup);
  } else {
    document.addEventListener("DOMContentLoaded", setup);
  }
})();
