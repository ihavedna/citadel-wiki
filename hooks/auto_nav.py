"""
on_config hook: keep the explicit nav in sync with the files on disk.

* Prune: drop nav entries whose .md file no longer exists (so renaming or
  deleting a page via GitHub doesn't break the strict build).
* Add: append any docs *.md not already in nav to its section folder's list
  (so a brand-new page — e.g. one made with the "New page" button — shows up
  in the nav and its section's child list, titled from its H1).

New files land at the end of their section; reorder in mkdocs.yml if desired.
"""
import glob
import os


def _prune(items, docs_dir):
    """Return items with .md entries whose file is missing removed."""
    kept = []
    for it in items:
        if isinstance(it, str):
            if it.endswith(".md") and not os.path.exists(os.path.join(docs_dir, it)):
                continue  # stale reference to a renamed/deleted file
            kept.append(it)
        elif isinstance(it, dict):
            new = {k: (_prune(v, docs_dir) if isinstance(v, list) else v)
                   for k, v in it.items()}
            kept.append(new)
        else:
            kept.append(it)
    return kept


def on_config(config, **kwargs):
    nav = config.get("nav")
    docs_dir = config["docs_dir"]
    if not nav:
        return config

    nav = _prune(nav, docs_dir)
    config["nav"] = nav

    referenced = set()
    folder_list = {}  # folder path -> the python list its entries live in

    def walk(items):
        for it in items:
            if isinstance(it, str):
                if it.endswith(".md"):
                    referenced.add(it)
                    folder_list.setdefault(os.path.dirname(it), items)
            elif isinstance(it, dict):
                for v in it.values():
                    if isinstance(v, str) and v.endswith(".md"):
                        referenced.add(v)
                        folder_list.setdefault(os.path.dirname(v), items)
                    elif isinstance(v, list):
                        walk(v)

    walk(nav)

    for path in sorted(glob.glob(os.path.join(docs_dir, "**", "*.md"), recursive=True)):
        rel = os.path.relpath(path, docs_dir).replace(os.sep, "/")
        if rel in referenced or os.path.basename(rel) == "index.md":
            continue
        target = folder_list.get(os.path.dirname(rel))
        if target is not None:
            target.append(rel)
            referenced.add(rel)
    return config
