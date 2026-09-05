# Launch Changelog

- Removed the visible redirecting entry page, splash delay, meta-refresh risk, and inline checkout redirect.
- Added a verified-session route guard so the menu, cart, and checkout cannot open before email confirmation.
- Added Supabase password auth, email OTP verification, and a 60-second resend cooldown.
- Added password autocomplete attributes and a Netlify CSP/security header set to reduce phishing-warning signals.
- Added a pending-payment order payload and PayFast integration comment block; merchant credentials and signature generation remain server-side.

Before launch, set `SHE_ATE_SUPABASE_URL` and `SHE_ATE_SUPABASE_ANON_KEY` in the deployment configuration, enable Supabase Auth rate limits, configure a CAPTCHA provider, and enable Netlify HTTPS enforcement. The `orders` table must accept the PayFast fields documented in the payment screen.