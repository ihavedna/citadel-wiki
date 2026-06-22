"""
on_config hook: auto-include docs *.md files that aren't already referenced in
the explicit nav by appending them to the matching section (matched by folder).

This lets a brand-new page (e.g. one created with the "New page" button) show
up in the nav and its section's child list — titled from its H1 — without
hand-editing mkdocs.yml, and without tripping the strict "not in nav" check.
New files land at the end of their section; reorder in mkdocs.yml if desired.
"""
import glob
import os


def on_config(config, **kwargs):
    nav = config.get("nav")
    docs_dir = config["docs_dir"]
    if not nav:
        return config

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
