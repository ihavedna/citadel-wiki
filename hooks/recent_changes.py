"""
MkDocs build hook: replaces a `<!-- recent-changes -->` marker with a table of
the most recently modified pages, read from git history at build time.

The site rebuilds on every push, so this stays current with each edit.
"""
import os
import re
import subprocess

MARKER = "<!-- recent-changes -->"
EXCLUDE = {"recent-changes.md"}  # don't list the page that hosts the list

_cache = None


def _title_for(relpath):
    """First H1 of a docs/<relpath> file, else a humanized filename."""
    abspath = os.path.join("docs", relpath)
    try:
        with open(abspath, encoding="utf-8") as fh:
            for line in fh:
                m = re.match(r"^#\s+(.+?)\s*$", line)
                if m:
                    return m.group(1)
    except OSError:
        pass
    return _humanize(os.path.splitext(os.path.basename(relpath))[0])


_SMALL = {"and", "or", "of", "the", "to", "from", "a", "an", "in", "on"}


def _humanize(slug):
    words = slug.replace("-", " ").split()
    out = []
    for i, w in enumerate(words):
        if w.isdigit():
            out.append(w)
        elif i > 0 and w in _SMALL:
            out.append(w)
        else:
            out.append(w.capitalize())
    return " ".join(out)


def _section_for(relpath):
    parts = os.path.dirname(relpath).split("/") if os.path.dirname(relpath) else []
    return " › ".join(_humanize(p) for p in parts) if parts else "—"


def _collect():
    """Ordered list of (relpath, date) for the most-recently-changed docs."""
    try:
        out = subprocess.run(
            ["git", "log", "--no-merges", "--date=short",
             "--pretty=format:\x01%ad", "--name-status", "--", "docs"],
            capture_output=True, text=True, check=True,
        ).stdout
    except Exception:
        return []

    seen, items, date = set(), [], None
    for line in out.splitlines():
        if line.startswith("\x01"):
            date = line[1:].strip()
            continue
        if not line.strip():
            continue
        cols = line.split("\t")
        status, path = cols[0], cols[-1]  # cols[-1] = (new) path, handles renames
        if status.startswith("D"):
            continue
        if not path.startswith("docs/") or not path.endswith(".md"):
            continue
        rel = path[len("docs/"):]
        if rel in seen or rel in EXCLUDE or not os.path.exists(path):
            continue
        seen.add(rel)
        items.append((rel, date))
    return items  # all changes, newest first; the page paginates client-side


def _render():
    global _cache
    if _cache is not None:
        return _cache
    items = _collect()
    if not items:
        _cache = "_No change history available yet._\n"
        return _cache
    rows = ["| Page | Section | Updated |",
            "| --- | --- | --- |"]
    for rel, date in items:
        title = _title_for(rel).replace("|", "\\|")
        section = _section_for(rel).replace("|", "\\|")
        rows.append(f"| [{title}]({rel}) | {section} | {date} |")
    _cache = "\n".join(rows) + "\n"
    return _cache


def on_page_markdown(markdown, page, config, files, **kwargs):
    if MARKER not in markdown:
        return markdown
    return markdown.replace(MARKER, _render())
