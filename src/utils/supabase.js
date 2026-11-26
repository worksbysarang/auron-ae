// ============================================================
// AURON.AE — Supabase Client
// Uses only the public anon key (safe for frontend).
// All data access is protected by Row Level Security (RLS).
// ============================================================

import { createClient } from '@supabase/supabase-js';

const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL  || '';
const supabaseAnon = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Return null-safe client for local dev without Supabase configured
export const supabase = supabaseUrl && supabaseAnon
  ? createClient(supabaseUrl, supabaseAnon)
  : null;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnon);

