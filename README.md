# The Kallarai Library

A wiki for the Kallarai Library, built with [MkDocs Material](https://squidfunk.github.io/mkdocs-material/) and published with GitHub Pages.

## Structure

- `docs/` — the wiki content (Markdown files)
- `mkdocs.yml` — site configuration and navigation
- `.github/workflows/deploy.yml` — builds and deploys to GitHub Pages on every push to `main`

## Editing

Edit any `.md` file under `docs/` and push to `main`. The site rebuilds and redeploys automatically. To add a page, create the file and add it to the `nav:` list in `mkdocs.yml`.

## Local preview

```bash
pip install -r requirements.txt
mkdocs serve
```

Open <http://localhost:8000>.
