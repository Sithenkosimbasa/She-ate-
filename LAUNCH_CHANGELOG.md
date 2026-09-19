# Launch Changelog

## 2026-09-19 — Security audit and modernization

- **Removed the client-side admin backdoor** in `menu_listing/code.html` (hardcoded `admin123` password, bypassable from the browser console). See `ADMIN_GUIDE.md` for the recommended RLS-backed replacement.
- **Fixed logout** — the "Log Out" button previously just navigated to the login screen without ending the Supabase session; it now calls `supabase.auth.signOut()`.
- **Fixed broken Supabase bootstrap** — `shared/supabase.js` read `window.SHE_ATE_SUPABASE_URL`/`ANON_KEY`, which nothing in the codebase or build ever set, so auth could not have worked in production. It now defines the config directly (placeholders — fill in the real project URL/anon key before launch).
- **Added `vercel.json`** with the security header set (CSP, HSTS, X-Frame-Options, Referrer-Policy, Permissions-Policy, Cross-Origin-Opener/Resource-Policy). The existing `_headers` file is a Netlify-only convention and is not read by Vercel for a static deploy, so if this site is hosted on Vercel (as `she-ate.vercel.app` suggests) those protections were likely never actually applied — `vercel.json` fixes that. Also fixed invalid comment syntax in `_headers` and added the same missing headers there for parity if ever deployed to Netlify.
- Added a shared footer (`shared/footer.js`) with links to Home, Menu, Order Tracking, Support, and the new Terms/Privacy pages, added to every screen that isn't inside the fixed bottom tab bar. Wired up the previously non-functional Privacy Policy / Terms of Use tiles on the Support screen, and added a Terms & Privacy entry to the Profile screen.
- Added `legal/terms.html` and `legal/privacy.html` (draft placeholders — not lawyer-reviewed).

- Removed the visible redirecting entry page, splash delay, meta-refresh risk, and inline checkout redirect.
- Added a verified-session route guard so the menu, cart, and checkout cannot open before email confirmation.
- Added Supabase password auth, email OTP verification, and a 60-second resend cooldown.
- Added password autocomplete attributes and a Netlify CSP/security header set to reduce phishing-warning signals.
- Added a pending-payment order payload and PayFast integration comment block; merchant credentials and signature generation remain server-side.

Before launch, set `SHE_ATE_SUPABASE_URL` and `SHE_ATE_SUPABASE_ANON_KEY` in the deployment configuration, enable Supabase Auth rate limits, configure a CAPTCHA provider, and enable Netlify HTTPS enforcement. The `orders` table must accept the PayFast fields documented in the payment screen.