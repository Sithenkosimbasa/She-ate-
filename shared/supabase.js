/* Set these in Netlify build environment variables or replace the placeholders before launch. */
const SHE_ATE_SUPABASE_URL = window.SHE_ATE_SUPABASE_URL || '';
const SHE_ATE_SUPABASE_ANON_KEY = window.SHE_ATE_SUPABASE_ANON_KEY || '';

if (window.supabase && SHE_ATE_SUPABASE_URL && SHE_ATE_SUPABASE_ANON_KEY) {
  window.sheAteClient = window.supabase.createClient(
    SHE_ATE_SUPABASE_URL,
    SHE_ATE_SUPABASE_ANON_KEY
  );
  window.sheAteAuth = window.sheAteClient.auth;
}