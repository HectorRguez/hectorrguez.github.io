# Hector's personal homepage

One source for https://hectorrguez.github.io/ and https://numbda.cs.tsinghua.edu.cn/~hector/.
The page preserves the original Tsinghua HTML, typography, layout and content.
All 18 dataset links point directly to Tsinghua. The repository contains no datasets.

## Edit and preview

Edit `public/index.html`, then run `npm run check`. No dependency installation or build is needed.
Run `npm start` to preview on http://127.0.0.1:3211.

## Publish the same source to both hosts

1. Commit and push to `main`. GitHub Actions checks the links and deploys only `public/` to GitHub Pages.
2. Run `npm run deploy:tsinghua` from this machine. It backs up the existing remote homepage and copies only `index.html` and `favicon.svg` through the existing `numbda-web` SSH alias. Dataset directories are never synchronized or deleted.

GitHub Pages serves the personal site without depending on this machine being online.
The Node server is only a local preview. There is no custom domain or production tunnel for this site.
