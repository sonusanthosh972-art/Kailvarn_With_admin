#!/usr/bin/env bash
# Builds the site and packages it for upload with FileZilla. Two outputs:
#
#   deploy/kailvarn-website-node.zip    full site for a Node.js host
#                                        (chatbot + AI tools work)
#   deploy/kailvarn-website-static.zip  plain HTML for ANY host's public_html
#                                        (no admin, forms saving, chatbot or AI tools —
#                                         they all need a server)
#
#   bash tools/package-deploy.sh            # both
#   bash tools/package-deploy.sh node       # only the Node.js package
#   bash tools/package-deploy.sh static     # only the static package
#
# The zip holds a self-contained Next.js server (server.js + only the
# node_modules it needs) — no `npm install` on the host. Secret keys are
# NOT included: set them as environment variables in the hosting panel
# (see .env.example inside the zip).
set -euo pipefail

cd "$(dirname "$0")/.."
ROOT="$(pwd)"
OUT="$ROOT/deploy"
PKG="$OUT/kailvarn-website-node"
WHAT="${1:-both}"
mkdir -p "$OUT"

build_node() {

echo "==> Building (next build, standalone output)"
rm -rf .next/standalone
npx next build

echo "==> Assembling $PKG"
rm -rf "$PKG" "$OUT/kailvarn-website-node.zip"
mkdir -p "$PKG"
cp -a .next/standalone/. "$PKG/"
# standalone leaves these two for you to copy:
mkdir -p "$PKG/.next"
cp -a .next/static "$PKG/.next/static"
rm -rf "$PKG/public" && cp -a public "$PKG/public"
# config/tooling files the tracer pulls in that the server never reads
rm -f "$PKG"/{components.json,eslint.config.mjs,jsconfig.json,postcss.config.js,skills-lock.json,tailwind.config.js}
# never ship secrets or dev certificates
find "$PKG" -maxdepth 1 -name '.env*' -delete
rm -rf "$PKG/certificates"

cat > "$PKG/.env.example" <<'EOF'
# Set these as ENVIRONMENT VARIABLES in your hosting panel (recommended),
# or copy this file to ".env" in this same folder and fill in the values.
# Never put this folder (or a .env file) inside public_html.

# Website chatbot (tokenin.my.id)
TOKENIN_BASE_URL=https://tokenin.my.id/v1
TOKENIN_API_KEY=
CHATBOT_MODEL=myt/gemini-3.5-flash-free,myt/glm-5.3-free,myt/qwen3.8-max-free,myt/grok-4.6-free

# AI room advisor / paint visualizer / redesign (Google Gemini)
GOOGLE_API_KEY=

# Wall segmentation (Hugging Face)
HF_TOKEN=

# Optional
PORT=3000
HOSTNAME=0.0.0.0
EOF

cat > "$PKG/HOW-TO-UPLOAD.txt" <<'EOF'
KAILVARN WEBSITE — NODE.JS DEPLOY PACKAGE
=========================================

Needs: a host with Node.js 18.18 or newer (20+ recommended).
       Hostinger "Node.js" apps, cPanel "Setup Node.js App", or any VPS.

1. Unzip kailvarn-website-node.zip on your computer.
2. In FileZilla, upload the WHOLE "kailvarn-website-node" folder
   (including the hidden ".next" folder — in FileZilla enable
   Server > Force showing hidden files) to your app folder, e.g.
   /home/<user>/kailvarn-website-node
   Do NOT put it inside public_html.
3. In the hosting panel, create a Node.js application:
     Application root : kailvarn-website-node
     Startup file     : server.js
     Node version     : 20 or newer
   Do NOT run "npm install" — node_modules is already included.
4. Add the environment variables listed in .env.example
   (TOKENIN_API_KEY, GOOGLE_API_KEY, HF_TOKEN, ...).
5. Start / restart the app and point your domain at it.

On a VPS instead:  cd kailvarn-website-node && PORT=3000 node server.js
(then put nginx in front, or use pm2:  pm2 start server.js --name kailvarn)

Updating later: re-run  bash tools/package-deploy.sh  in the project,
upload the new folder over the old one, restart the app.
EOF

echo "==> Zipping"
(cd "$OUT" && zip -qr kailvarn-website-node.zip kailvarn-website-node)
du -sh "$OUT/kailvarn-website-node.zip"
}

build_static() {
  # Static export can't include server code, so build from a throwaway copy
  # (inside the project so it resolves ../node_modules) without app/api,
  # the catch-all route and the chat widget. The real project is untouched.
  local TMP="$ROOT/.static-build" SPKG="$OUT/kailvarn-website-static"
  echo "==> Building static HTML export"
  rm -rf "$TMP" "$SPKG" "$OUT/kailvarn-website-static.zip"
  mkdir -p "$TMP"
  cp -a app src public package.json next.config.mjs tailwind.config.js postcss.config.js jsconfig.json instrumentation.js "$TMP/"
  # server-only parts: API routes, admin panel, catch-all route
  rm -rf "$TMP/app/api" "$TMP/app/admin" "$TMP/app/(site)/[...catchAll]"
  python3 - "$TMP" <<'PY'
import sys
t = sys.argv[1]
p = f"{t}/next.config.mjs"; s = open(p).read()
s = s.replace("output: 'standalone',", "output: 'export',\n  trailingSlash: true,\n  images: { unoptimized: true },\n  turbopack: { root: new URL('..', import.meta.url).pathname },")
open(p, "w").write(s)
p = f"{t}/app/(site)/layout.jsx"; s = open(p).read()
s = s.replace("import ChatWidget from '@/components/ChatWidget.jsx';\n", "").replace("      <ChatWidget />\n", "")
open(p, "w").write(s)
PY
  cat > "$TMP/app/not-found.jsx" <<'EOF2'
import HomePage from '@/views/HomePage.jsx';
import SiteLayout from './(site)/layout.jsx';

// Static hosting: unknown URLs show the homepage (was app/(site)/[...catchAll]).
export default function NotFound() {
  return <SiteLayout><HomePage /></SiteLayout>;
}
EOF2
  (cd "$TMP" && ../node_modules/.bin/next build)
  mkdir -p "$SPKG"
  cp -a "$TMP/out/." "$SPKG/"
  rm -rf "$TMP"
  cat > "$SPKG/.htaccess" <<'EOF2'
# KailVarn static site (Apache / Hostinger / cPanel)
Options -Indexes
DirectorySlash On
ErrorDocument 404 /404.html
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType text/css "access plus 1 year"
  ExpiresByType application/javascript "access plus 1 year"
  ExpiresByType font/woff2 "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 month"
</IfModule>
EOF2
  cat > "$OUT/HOW-TO-UPLOAD-STATIC.txt" <<'EOF2'
KAILVARN WEBSITE — STATIC PACKAGE (any web host)
================================================

Works on any hosting (Hostinger, cPanel, GoDaddy...), no Node.js needed.
NOT included (they need a server): the admin dashboard, saving of the
Quote / Consultation / Contact forms, the portfolio from the admin, the
website chatbot and the AI tools. Pages, the built-in design gallery and
WhatsApp/call buttons work. For the full system use the Node.js package.

1. Unzip kailvarn-website-static.zip on your computer.
2. In FileZilla, turn on  Server > Force showing hidden files
   (so the .htaccess file is uploaded too).
3. Open your site's  public_html  folder on the server, delete the old
   website files there (keep a backup), and upload EVERYTHING that is
   INSIDE the "kailvarn-website-static" folder into public_html
   (index.html must end up directly in public_html).
4. Open your domain in the browser. Done.
EOF2
  cp "$OUT/HOW-TO-UPLOAD-STATIC.txt" "$SPKG/HOW-TO-UPLOAD.txt"
  (cd "$OUT" && zip -qr kailvarn-website-static.zip kailvarn-website-static)
  du -sh "$OUT/kailvarn-website-static.zip"
}

case "$WHAT" in
  node) build_node ;;
  static) build_static ;;
  both) build_node; build_static ;;
  *) echo "usage: $0 [node|static|both]"; exit 1 ;;
esac
echo "Done. Packages are in $OUT/"
