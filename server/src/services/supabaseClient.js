import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

let supabase = null;

export function getSupabase() {
  if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('your-project')) {
    return null; // Not configured — will use fallback data
  }
  if (!supabase) {
    supabase = createClient(supabaseUrl, supabaseKey);
  }
  return supabase;
}

/**
 * Keep-alive ping — prevents Supabase free-tier auto-pause (7 day inactivity).
 * Runs a lightweight query every 6 days while the server is up.
 * Works alongside the pg_cron job as a second safety net.
 */
const SIX_DAYS_MS = 6 * 24 * 60 * 60 * 1000;

export function startKeepAlive() {
  const client = getSupabase();
  if (!client) return;

  const ping = async () => {
    try {
      const { error } = await client.from('projects').select('id').limit(1);
      if (error) throw error;
      console.log('🏓 Supabase keep-alive ping OK', new Date().toISOString());
    } catch (err) {
      console.error('🏓 Keep-alive ping failed:', err.message);
    }
  };

  // Initial ping on startup
  ping();
  // Then every 6 days
  setInterval(ping, SIX_DAYS_MS);
}
