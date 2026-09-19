# She Ate - Admin Panel Guide

## This feature has been removed

The previous version of `menu_listing/code.html` shipped a client-side "admin panel" that could be unlocked by clicking the header logo 5 times and entering the password `admin123`, which was hardcoded in plain text in the page's JavaScript and documented in this file.

That implementation had no real security:

- The password was visible to anyone who read the page source.
- Admin mode could be enabled directly from the browser console (`adminPanel.setAdminMode(true)`) — the password prompt was never actually required.
- "Admin" state and menu edits were stored in `localStorage`, which is per-browser and trivially editable by any visitor, not a real authorization mechanism.

It has been removed from the site as part of a security audit.

## Recommended replacement

Follow the same pattern used by the Vaultly reference app's `/admin` panel:

1. Add an `is_admin` (or `role`) column to the `profiles` table in Supabase, defaulting to `false`, settable only via the Supabase dashboard or a trusted server-side process — never from client code.
2. Add Row Level Security policies on the `menu_items` table so `INSERT`/`UPDATE`/`DELETE` are only allowed when `auth.uid()` matches a profile with `role = 'admin'`.
3. Build the admin UI as a normal authenticated page that calls `supabase.auth.getSession()` and checks the caller's role (client-side check for UX only — RLS is what actually enforces it) before rendering the edit form.

Until that's built, treat the live menu as static content edited directly in `menu_listing/code.html` and deployed through the normal build/deploy process.
