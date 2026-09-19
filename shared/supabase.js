/*
 * Supabase project config — the anon key is safe to expose client-side because
 * every table it can reach is protected by Row Level Security policies.
 * TODO: replace the placeholders below with this project's real values
 * (Supabase dashboard -> Project Settings -> API) before launch.
 */
const SHE_ATE_SUPABASE_URL = 'https://YOUR-PROJECT-REF.supabase.co';
const SHE_ATE_SUPABASE_ANON_KEY = 'YOUR-SUPABASE-ANON-KEY';

const isConfigured =
  SHE_ATE_SUPABASE_URL.indexOf('YOUR-PROJECT-REF') === -1 &&
  SHE_ATE_SUPABASE_ANON_KEY.indexOf('YOUR-SUPABASE-ANON-KEY') === -1;

if (window.supabase && isConfigured) {
  window.sheAteClient = window.supabase.createClient(
    SHE_ATE_SUPABASE_URL,
    SHE_ATE_SUPABASE_ANON_KEY
  );
  window.sheAteAuth = window.sheAteClient.auth;
} else if (!isConfigured) {
  console.warn('She Ate: Supabase is not configured yet — set SHE_ATE_SUPABASE_URL/ANON_KEY in shared/supabase.js.');
}
