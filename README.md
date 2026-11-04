# Hector's personal homepage

One source for https://hectorr.dev/ and https://numbda.cs.tsinghua.edu.cn/~hector/.
The page preserves the original Tsinghua HTML, typography, layout and content.
All 18 dataset links point directly to Tsinghua. The repository contains no datasets.

## Edit and verify

Edit `public/index.html`, then run `npm run check`. No dependency installation or build is needed.
Run `npm start` to preview on http://127.0.0.1:3211. The server exposes only the homepage, favicon and health check.

## Publish the same source to both hosts

1. Commit and push the reviewed change to this repository.
2. On this machine, update the checkout using `git pull --ff-only`; the server reads the current HTML on each request.
3. Run `npm run deploy:tsinghua` from this machine. It backs up the existing remote homepage and copies only `index.html` and `favicon.svg` through the existing `numbda-web` SSH alias. Dataset directories are never synchronized or deleted.

The custom domain uses a dedicated Cloudflare Tunnel to a loopback-only Node service on this machine. Both services restart after failure and start at boot through the existing lingering systemd user manager.

```sh
systemctl --user status hector-personal-site hector-personal-tunnel
journalctl --user -u hector-personal-site -u hector-personal-tunnel -n 40
```

Service definitions are in `deployment/`. The tunnel configuration and credentials live outside the repository under `~/.config/hector-personal-site/` and `~/.cloudflared/`.
