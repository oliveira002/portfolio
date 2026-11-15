<div align="center">

<img src="assets/favicon.svg" width="88" alt="JO">

<h1>João Oliveira</h1>

<p>My personal website and CV.<br>
One static page, written in a single JSON file, with no framework and no build step.</p>

<p>
  <img src="https://img.shields.io/badge/HTML%20%2B%20CSS-plain-111" alt="Plain HTML and CSS">
  <img src="https://img.shields.io/badge/CV-LaTeX-008080?logo=latex&logoColor=white" alt="CV in LaTeX">
  <img src="https://img.shields.io/badge/Dependencies-none-2F7A55" alt="No dependencies">
</p>

<br>

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/site-dark.png">
  <img src="docs/site-light.png" alt="The website's home section" width="880">
</picture>

</div>

## Editing

- **Website.** Everything the page shows lives in `content.json`: the intro, about, experience, education and links.
- **CV.** Edit `cv/cv.tex`, then rebuild the PDF the site links to:

```bash
brew install tectonic   # once
tools/build-cv
```

## Preview

```bash
tools/preview
```

Opens the site on `http://localhost:8000`. It needs a local server because the page reads `content.json`.

<br>

<p align="center"><sub>Made by João Oliveira</sub></p>
