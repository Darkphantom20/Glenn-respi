/* ============================================================
 * db-connection.js — Supabase credentials + client. Isolated.
 * ============================================================ */

const CRED_KEY = 'gg_supa_creds';
const AUTH_KEY = 'gg_admin';

let supa = null;   // global Supabase client

function getCreds() {
  try {
    const saved = JSON.parse(localStorage.getItem(CRED_KEY) || 'null');
    if (saved && saved.url && saved.key) return saved;
  } catch (e) {
    console.error('Saved Supabase credentials could not be read:', e);
  }
  const { url, anonKey } = CFG.supabase || {};
  return url && anonKey ? { url, key: anonKey } : null;
}

function saveCreds(url, key) {
  localStorage.setItem(CRED_KEY, JSON.stringify({ url, key }));
}

function clearCreds() {
  localStorage.removeItem(CRED_KEY);
}

function initSupabase() {
  const creds = getCreds();
  if (!creds || !creds.url || !creds.key) return false;
  if (!window.supabase) {
    console.error('Supabase SDK not loaded');
    return false;
  }
  try {
    supa = window.supabase.createClient(creds.url, creds.key);
    return true;
  } catch (e) {
    console.error('Supabase init failed:', e);
    return false;
  }
}
