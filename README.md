# Hector's personal homepage

One source for https://hectorrguez.github.io/ and https://numbda.cs.tsinghua.edu.cn/~hector/.
The page keeps the original Tsinghua typography and layout, split into two static pages: About (`index.html`) and CV with publications (`cv/index.html`), served at `/` and `/cv/`.
`Hector-Rodriguez-Rodriguez-CV.pdf` is a copy of `~/Documents/cv/roles/phd-application/cv_phd_application.pdf` (no phone number); re-copy it when the CV changes.
The CapBench dataset files stay on the Tsinghua server; the site no longer lists them. The repository contains no datasets.

## Edit and preview

Edit the pages in `public/`, then run `npm run check`. No dependency installation or build is needed.
Run `npm start` to preview on http://127.0.0.1:3211.

## Publish the same source to both hosts

1. Commit and push to `main`. GitHub Actions checks the links and deploys only `public/` to GitHub Pages.
2. Run `npm run deploy:tsinghua` from this machine. It backs up the existing remote homepage and copies only the two pages, `favicon.svg`, `photo.jpg` and the CV PDF through the existing `numbda-web` SSH alias. Dataset directories are never synchronized or deleted.

GitHub Pages serves the personal site without depending on this machine being online.
The Node server is only a local preview. There is no custom domain or production tunnel for this site.

The pages use Geist Mono (SIL OFL 1.1), self-hosted in `public/fonts/` from `@fontsource/geist-mono@5.3.0` (latin subset, weights 400 and 600).
