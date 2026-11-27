#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
node scripts/check.cjs
# Explicit file list: never synchronize or delete the hosted dataset directories.
ssh numbda-web 'mkdir -p ~/website-backups; cp ~/public_html/index.html ~/website-backups/index-before-github-$(date -u +%Y%m%dT%H%M%SZ).html'
ssh numbda-web 'mkdir -p ~/public_html/cv ~/public_html/publications'
scp public/index.html public/favicon.svg public/photo.jpg public/Hector-Rodriguez-Rodriguez-CV.pdf numbda-web:public_html/
scp public/cv/index.html numbda-web:public_html/cv/
scp public/publications/index.html numbda-web:public_html/publications/
