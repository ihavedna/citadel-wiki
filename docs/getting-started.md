# Getting Started

This wiki is built from Markdown files in the `docs/` directory. Every push to the `main` branch rebuilds and redeploys the site automatically via GitHub Actions.

## Adding a page

1. Create a new Markdown file under `docs/`, e.g. `docs/lore.md`.
2. Add it to the `nav:` list in `mkdocs.yml` so it appears in the navigation.
3. Commit and push to `main`.

## Editing a page

Click the **pencil icon** at the top of any page to edit its source directly on GitHub, or edit the file under `docs/` locally and push.

## Previewing locally

```bash
pip install mkdocs-material
mkdocs serve
```

Then open <http://localhost:8000> in your browser. The preview reloads as you edit.

## Building locally

```bash
mkdocs build
```

This generates the static site into the `site/` directory.
