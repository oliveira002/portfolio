<div align="center">

<img src="assets/favicon.svg" width="88" alt="JO">

<h1>João Oliveira</h1>

<p>My personal website and CV, kept simple:<br>
one page, one content file, no framework.</p>

<p>
  <img src="https://img.shields.io/badge/HTML%20%2B%20CSS-plain-111" alt="Plain HTML and CSS">
  <img src="https://img.shields.io/badge/CV-LaTeX-008080?logo=latex&logoColor=white" alt="CV in LaTeX">
  <img src="https://img.shields.io/badge/Dependencies-none-2F7A55" alt="No dependencies">
</p>

<br>

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/site-dark.png">
  <img src="docs/site-light.png" alt="João Oliveira's website" width="880">
</picture>

</div>

## What's inside

- **Website.** A single page built from `content.json` by `tools/build-site.mjs`.
- **CV.** Written in LaTeX in `cv/cv.tex`, with the PDF next to it.

## Updating

Change the words in `content.json` and push; a GitHub Action rebuilds `index.html`. Run `tools/preview` to see it locally first. For the CV, edit `cv/cv.tex` and run `tools/build-cv` to refresh the PDF.

<br>

<p align="center"><sub>Made by João Oliveira</sub></p>
