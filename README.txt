SUMMIT WINDOWS & DOORS — MEDIA BROWSER
======================================

Online product media library (photos, videos, 3D, cases, notes, info & docs).

DEPLOY — Cloudflare Pages
-------------------------
1. Push this repo to GitHub
2. Cloudflare Dashboard → Workers & Pages → Create → Pages → Connect to Git
3. Select this repository
4. Build settings:
   - Framework preset: None
   - Build command: (leave empty)
   - Build output directory: /
5. Deploy. Site will be available at your *.pages.dev URL

DEFAULT PASSWORDS
-----------------
Visitor gate:   summit2026
Admin mode:     admin0000
Pricing PIN:    0000

Passwords can be changed in Admin → 密码设置 (stored in browser localStorage).

NOTES
-----
- Media uploaded in the browser is stored per-device (IndexedDB), not in this repo.
- Put logo.png and hero.jpg in images/ if you want default branding assets in the deploy.
- Local preview (optional): python3 -m http.server 8080
