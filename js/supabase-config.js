
// ========================================
// INIKORE — SUPABASE CONFIGURATION
// ========================================

window.INIKORE_SUPABASE_URL =
    "https://vakgwoeddzfflljflwyd.supabase.co";

window.INIKORE_SUPABASE_KEY =
    "sb_publishable_2AUXdwLPvOjcsqYOTeVc-Q_02Kj_gag";

// Create Supabase client
window.inikoreSupabase = window.supabase.createClient(
    window.INIKORE_SUPABASE_URL,
    window.INIKORE_SUPABASE_KEY
);

console.log("INIKORE Supabase connection initialized.");
