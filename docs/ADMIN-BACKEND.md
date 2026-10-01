# KailVarn — backend, admin & data flow

Public website + admin dashboard in one Next.js 16 app, with **MongoDB** for
data and **Backblaze B2** for images.

```
ADMIN → upload → browser optimises to WebP → presigned PUT → B2 → metadata → MongoDB → publish → /our-design
VISITOR → Get Free Quote / Book Consultation / Contact → /api/* → MongoDB → /admin
```

## 1. First-time setup

```bash
npm install
cp .env.example .env.local          # then fill in real values (see §2)
node tools/set-admin-password.mjs   # creates your admin login (email + password)
npm run dev                         # http://localhost:3000  ·  admin: /admin
```

`set-admin-password.mjs` stores only a bcrypt hash (never the password). The
first login creates the admin in MongoDB; after that, change the password
from **/admin/settings** (or rerun the script).

## 2. Environment variables (`.env.local`, never committed)

| Variable | Purpose |
|---|---|
| `MONGODB_URI` | Atlas connection string. URL-encode special characters in the password (`@` → `%40`). |
| `MONGODB_DB` | Database name (`kailvarn`). |
| `B2_KEY_ID`, `B2_APPLICATION_KEY` | Backblaze application key (use a key restricted to the bucket). |
| `B2_BUCKET_NAME` | `Kailvarn` |
| `B2_ENDPOINT`, `B2_REGION` | `https://s3.us-east-005.backblazeb2.com`, `us-east-005` |
| `B2_KEY_PREFIX` | `Kailvarn/` — all objects live under it (the key is restricted to this prefix). |
| `B2_PUBLIC_URL` | Optional. Empty = images served by `/api/media/<key>` (works with a private bucket, cached 1 year). Set to a public bucket/CDN URL to serve directly. |
| `NEXTAUTH_SECRET` | 32+ random chars; signs the admin session cookie. |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH` | Bootstrap admin (set with the script). In `.env` files each `$` of the hash is escaped as `\$`; in a hosting panel paste the raw hash. |
| `COOKIE_SECURE` | Only set to `false` if production runs on plain HTTP. |

## 3. MongoDB collections

| Collection | Key fields |
|---|---|
| `admins` | email (unique), passwordHash (bcrypt), name, lastLoginAt, createdAt, updatedAt |
| `projects` | title, slug (unique), category, subtitle, legacyId (imported items), status `draft`/`published`, description, location, tags[], coverImageId, imageCount, publishedAt, createdAt, updatedAt |
| `images` | projectId, fileName, b2Key (unique), externalUrl (imported photos), thumbKey, category, altText, contentType, size, width, height, order, createdAt, updatedAt — `publicUrl`/`thumbUrl` are derived |
| `quotes` | name, phone, email, city, service, projectType, budget, source, contactMethod, message, status, notes, createdAt, updatedAt |
| `consultations` | name, phone, email, city, service, projectType, preferredDate, preferredTime, message, status, notes, createdAt, updatedAt |
| `contacts` | name, phone, email, city, service, message, status, notes, createdAt, updatedAt |
| `site_content` | `_id` = page (`our-design`), fields {…text}, heroImages [{ id, b2Key, thumbKey }], updatedAt, updatedBy |

Lead status: `NEW → CONTACTED → IN_PROGRESS → COMPLETED / CLOSED`.
Categories: Full Home, Living Room, Bedroom, Kids Bedroom, Kitchen, Furniture, Painting, Commercial.
Indexes are created automatically on first connection (`src/server/db.js`).

## 4. API routes

All responses: `{ ok: true, data }` or `{ ok: false, error: { message, fields? } }`.

Public
- `POST /api/quotes` · `POST /api/consultations` · `POST /api/contact` — validated, rate-limited (5 / 10 min / IP), honeypot-protected
- `GET /api/designs?category=&page=&limit=` — published projects only, paginated
- `GET /api/designs/:idOrSlug`
- `GET /api/media/<key>` — serves design images from the private bucket
- `GET /api/content/:page` — editable page text + hero images (`our-design`)

Admin (session cookie required — enforced by `proxy.js` **and** in each handler; cross-site writes blocked)
- `POST /api/admin/login` · `POST /api/admin/logout` · `GET /api/admin/me`
- `GET /api/admin/stats`
- `GET|POST /api/admin/designs` · `GET|PATCH|DELETE /api/admin/designs/:id` (PATCH also takes `coverImageId`, `imageOrder[]`)
- `POST /api/admin/uploads` → presigned URLs · `POST /api/admin/uploads/complete` (verifies the object in B2, saves metadata) · `POST /api/admin/uploads/direct` (server fallback)
- `PATCH|DELETE /api/admin/images/:id`
- `GET /api/admin/{quotes|consultations|contact}?q=&status=&page=` · `GET|PATCH|DELETE …/:id`
- `GET|PUT /api/admin/content/:page` · `POST /api/admin/content/:page/images` · `DELETE /api/admin/content/:page/images/:imageId`
- `POST /api/admin/settings/password`

## 5. Admin pages

`/admin/login` · `/admin` (dashboard) · `/admin/designs` · `/admin/designs/:id` · `/admin/content/our-design` ·
`/admin/upload` · `/admin/quotes` · `/admin/consultations` · `/admin/contact` · `/admin/settings`

### Managing the Our Design page

- **Page text & hero photos** — *Our Design Page* (`/admin/content/our-design`): hero label, title, gold
  italic ending, intro, up to 4 hero photos, empty-category message and the bottom call-to-action
  (title, text, both buttons + links). Stored in the `site_content` collection; until edited, the
  original wording is used (`src/constants/pageContent.js`). "Reset to original" per field.
- **Gallery items** — *Designs*: every card is a project (title, card label/subtitle, category,
  location, tags, description, photos, cover, order, published/draft).
- The old hardcoded portfolio (200 items) was imported with
  `node --env-file=.env.local tools/import-legacy-portfolio.mjs` (safe to re-run; skips existing).
  23 items with photos are published; 177 without photos are drafts. Imported photos are marked
  *From old site*; to replace one, upload a new photo, set it as cover, delete the old one.

## 6. Testing

- **B2 upload:** /admin → Designs → New project → drop images in the editor → each shows *Uploaded ✓* → Publish → open /our-design.
- **Quote:** submit /get-free-quote → it appears in /admin/quotes → open it, change status, add a note.
- Same for /book-consultation → /admin/consultations and /contact → /admin/contact.

## 7. Production deployment

Needs a **Node.js** host (the static package cannot run the admin/API).

- **Vercel** (current site): add every variable from §2 under Project → Settings → Environment Variables (raw bcrypt hash, no backslashes), redeploy. Add the production domain to the B2 CORS rule (§8) if it differs.
- **Node host / VPS / Hostinger Node app:** `bash tools/package-deploy.sh node` → upload `deploy/kailvarn-website-node/`, set the env vars in the panel, start `server.js`.

## 8. Backblaze B2 notes

- Bucket `Kailvarn` is **private**; images are served through `/api/media` with 1-year caching. For lower server load, make the bucket public (or put Cloudflare in front) and set `B2_PUBLIC_URL`.
- CORS rule `kailvarnAdminUploads` allows browser uploads (PUT/GET/HEAD) from: localhost:3000/3100, 172.29.7.22:3000, testing-ai-omega.vercel.app, kailvarn.com, www.kailvarn.com. Add any new domain in the B2 console (Bucket → CORS Rules) — otherwise uploads automatically fall back to going through the server.
- Object keys: `Kailvarn/designs/<category>/<project-slug>/<random>.webp` (+ `-thumb.webp`). User file names are never used in keys.
