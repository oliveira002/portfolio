# Portfolio

Personal website and CV of João Oliveira.

## Edit

- Website text: `content.json`. The page reads everything from it.
- CV: `cv/cv.tex`, then run `tools/build-cv` to rebuild `cv/cv.pdf` (needs `brew install tectonic`).

## Preview

```sh
tools/preview
```

Serves the site on http://localhost:8000. It needs a local server because the page loads `content.json`.
