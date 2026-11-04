#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
node scripts/check.cjs
# Explicit file list: never synchronize or delete the hosted dataset directories.
ssh numbda-web 'mkdir -p ~/website-backups; cp ~/public_html/index.html ~/website-backups/index-before-github-$(date -u +%Y%m%dT%H%M%SZ).html'
scp public/index.html public/favicon.svg numbda-web:public_html/
