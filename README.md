# ESCAPE | Warranty Platform

**Actual full-stack project** (not a localStorage mock). Arabic customer UI based on the approved ESCAPE_ACTIVATION_WHATSAPP_FINAL_PREVIEW; private owner dashboard; existing Neon PostgreSQL; on-demand server PDF certificate; Meta WhatsApp Cloud API integration. Designed for public internet deployment after configuration.

## Included

- `docs/ESCAPE_OFFLINE_DESIGN_PREVIEW.html`: standalone, visual-only approved customer design preview; NOT connected to Neon. Open directly in Chrome/Safari to inspect layout.


- `public/index.html`, `styles.css`, `app.js`: approved customer interface, activation, public verification, private certificate retrieval, WhatsApp help.
- `private/admin.html`, `public/admin.*`, `public/admin-login.html`: session-protected owner dashboard, manual one-by-one code creation, reports by shop letter/product, product durations, suspension, WhatsApp status and retries.
- `server.js`: server-only DB access, rate limiting, CSRF protection for admin writes, bcrypt admin authentication, PostgreSQL sessions, no credentials in frontend, atomic single-use activation, PDF download authorization, WhatsApp delivery queue.
- `certificate.js`: A4 PDF designed after the approved dark-navy/cyan ESCAPE premium certificate, with product, code, start/end dates, QR and support. Uses the Arabic font dependency installed via npm (no font file in this project archive).
- `whatsapp.js`: Meta Cloud API document-header template for sending the certificate PDF and OTP template for phone-based lookup.
- `docs/ESCAPE_EXISTING_NEON_SCHEMA_REFERENCE.sql`: **reference only** to the six tables already created in your Neon project. Do NOT rerun it on your production DB without migration review.
- `tests/lib.test.js`: code format, Saudi mobile normalization, signed PDF URL validation.

## Start locally (requires Node.js 20+ and an existing Neon DB)

1. Extract ZIP, open a terminal in the `ESCAPE_PRODUCTION_SITE` folder.
2. Run `npm install`.
3. Copy `.env.example` to `.env` (never upload `.env` to GitHub).
4. In Neon, choose **Connect** and copy the **pooled connection string** into `DATABASE_URL` in `.env`. Treat it as a password: never share it in screenshots or chats.
5. Set `ADMIN_EMAIL` to your actual admin email; generate a bcrypt password hash using `npm run hash-password` in an interactive terminal; paste the printed `ADMIN_PASSWORD_HASH` in `.env`.
6. Generate three separate secrets using `openssl rand -hex 32` for `SESSION_SECRET`, `PDF_SIGNING_SECRET`, `OTP_SECRET`.
7. For local development set `BASE_URL=http://localhost:3000` and `NODE_ENV=development`. Run `npm run check`, then `npm start`.
8. Customer site: `http://localhost:3000/` — admin login: `http://localhost:3000/admin/login`.
9. Create **one** real code in the dashboard (`A-4827` is just an example; choose an unused code). Then activate it from the customer page. An activated code cannot be reused; **do not use production inventory codes for testing**.

## Neon compatibility

The project is written for the **existing** schema:
`public.products`, `public.warranty_codes`, `public.whatsapp_messages`, `public.phone_verifications`, `public.admin_logs`, `public.settings`, the view `public.shop_warranty_summary`, and the SQL function `public.activate_warranty(text,text,boolean)`.

On startup, the app automatically creates an additional `user_sessions` table for server-side admin/customer verification sessions (requires DB permission). The previous six ESCAPE tables remain intact.

The code format is `A-1234` (any **one uppercase Latin letter** A-Z, dash, exactly **four digits**). The owner enters every code individually; shop letter is derived automatically. Product options: `thermal` 60 months, `glass` 12 months; edit durations from dashboard. Start/installation date is the activation date in Saudi time; existing activated warranties keep their original end dates when you change a product duration.

## Deploy to the public internet

GitHub is **source hosting**; GitHub Pages **cannot** run this Node.js/Neon application. Connect your GitHub repository to a Node.js-capable hosting service, configure the environment variables as **server secrets**, deploy with build `npm install` and start `npm start`, and attach the Hostinger-managed domain by setting DNS as your host instructs. Set `NODE_ENV=production`, `BASE_URL=https://your-real-domain`, ensure HTTPS, and use a provider with persistent Node service and outbound internet access. Free plans may sleep, cap traffic, or change terms; no promise of always-on free hosting.

**Do not point the domain at GitHub Pages** for this full-stack app, and never store `DATABASE_URL`, Meta tokens, session secrets, or admin password hash in browser JS, GitHub repository, or DNS.

## WhatsApp Cloud API

WhatsApp messages will not be delivered until the Meta business account, phone-number ID, access token and **approved** templates are configured. The customer always gets a downloadable PDF on successful activation, even if WhatsApp delivery fails.

Required for certificate delivery:
- `META_ACCESS_TOKEN`: production system-user token (server-side only).
- `META_PHONE_NUMBER_ID`: numeric ID from WhatsApp Cloud API (not your visible mobile number).
- `WHATSAPP_CERT_TEMPLATE`: Meta-approved template **with a DOCUMENT header** and **one text body variable** (the warranty code). Match `WHATSAPP_CERT_LANGUAGE`.
- `BASE_URL`: public HTTPS address. Meta must be able to download the PDF via the short-lived signed URL.

Optional phone lookup:
- `WHATSAPP_OTP_TEMPLATE`: approved Meta template with one text variable for the six-digit OTP; match `WHATSAPP_OTP_LANGUAGE`. Without this, users can still verify warranty status by code and download the PDF by matching code + phone. The phone-only search button clearly reports that it requires WhatsApp OTP setup.

Optional delivery-status webhook:
- Set `META_VERIFY_TOKEN` and `META_APP_SECRET`; register `https://your-domain/webhooks/meta` in Meta Developer Dashboard, subscribe to message status events. The app validates the X-Hub-Signature-256 HMAC.

Message statuses are tracked in `public.whatsapp_messages`. `accepted` means Meta accepted the request, **not** proof of delivery; `delivered` is reported via webhook. Failed messages may be manually retried in admin. Meta may charge for template messaging and impose limits.

## Security and production caveats

- Admin login uses bcrypt + PostgreSQL-backed HttpOnly SameSite=Strict session cookie; production HTTPS uses Secure cookies; login is rate-limited; session regenerated after login; admin writes use session CSRF token and origin checks.
- All DB operations use parameterized queries. Customer warranty lookup by code exposes only non-personal fields. PDF download requires signed expiring link or code + exact customer phone; phone-only search requires OTP verification.
- Activation is atomic in the existing PostgreSQL function; code cannot activate twice. Product/phone/activation dates are protected by existing SQL trigger. Code creation is owner-only.
- Server-side Content Security Policy, frame blocking, HSTS on production, no secrets in client assets. Rate limits here are **in-process**, so add a provider/WAF-level limiter for multiple instances, DDoS and IP rotation.
- The PDF link embedded in a WhatsApp template expires after 1 hour; WhatsApp fetches the document at send time. Long-term re-download requires code+phone or verified phone.
- This is not a claim of zero vulnerabilities. Before live use, verify all dependencies, install security updates, configure backups/retention and access controls in Neon, confirm correct DNS/HTTPS/proxy configuration, perform a real activation+PDF+WhatsApp integration test and an independent security review.
- **Tested here:** Node.js syntax and local unit tests, plus static source audit for the exact frontend asset routes and Gregorian date display. **Not tested here:** installation of npm dependencies, actual connection to your Neon project, real Meta API calls, live PDF rendering, load testing or penetration testing. Do not market it as audited or production-certified until those checks pass.

## Prelaunch checklist (required)

- [ ] `npm install` succeeds on the actual hosting provider, and `npm run check` passes.
- [ ] `/styles.css`, `/app.js`, `/admin.css`, and `/admin.js` load with HTTP 200 (not 404).
- [ ] A real admin can log in over HTTPS; wrong credentials and missing CSRF token are rejected.
- [ ] Add one **test-only** code from admin; activate exactly once; repeat activation must fail.
- [ ] Download the PDF and inspect Arabic lettering, dates, QR and product details.
- [ ] Validate both code verification and the phone ownership / OTP flow.
- [ ] Send a real approved WhatsApp template to a consenting test number; check webhook status.
- [ ] Set up Neon backups, secret rotation, hosting/WAF rate limits, and security updates.
- [ ] Use a proper domain and HTTPS; never expose DATABASE_URL, admin hashes or tokens.

**No guarantee of invulnerability:** security measures reduce risks but are not a substitute for a live security assessment.
