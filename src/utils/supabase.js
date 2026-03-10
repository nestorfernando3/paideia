// ==========================================================================
// PAIDEIA — Supabase Configuration
// Conexión a Supabase Auth + Postgres
// ==========================================================================

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

let supabase = null;
let authReadyPromise = Promise.resolve(false);
let authError = null;

if (supabaseUrl && supabaseAnonKey) {
    supabase = createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: true,
        },
    });

    authReadyPromise = ensureAnonymousSession();
} else {
    authError = new Error('Supabase environment variables are missing');
    console.warn('Supabase not configured — set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
}

export function isSupabaseReady() {
    return supabase !== null;
}

export async function waitForSupabaseAuth() {
    return authReadyPromise;
}

export function getSupabaseAuthError() {
    return authError;
}

export { supabase };

async function ensureAnonymousSession() {
    try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;

        if (data.session) {
            authError = null;
            return true;
        }

        const { error: signInError } = await supabase.auth.signInAnonymously();
        if (signInError) throw signInError;

        authError = null;
        console.log('Signed in anonymously to Supabase');
        return true;
    } catch (error) {
        authError = error;
        console.error('Error signing in anonymously to Supabase:', error);
        return false;
    }
}
