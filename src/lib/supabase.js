import { createClient } from '@supabase/supabase-js';

const rawUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseUrl = (rawUrl.startsWith('http://') || rawUrl.startsWith('https://'))
  ? rawUrl
  : 'https://roecjqiqqcwhkiimfftf.supabase.co';

const rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const supabaseAnonKey = rawKey.trim() !== ''
  ? rawKey
  : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJvZWNqcWlxcWN3aGtpaW1mZnRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDAwMDAwMDAsImV4cCI6MjAyNTAwMDAwMH0.placeholder';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

/**
 * Helper to register a new user with Supabase Auth
 */
export const signUpWithSupabase = async ({ email, password, phone, name }) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          phone,
          full_name: name
        }
      }
    });

    if (error) throw error;
    return { data, error: null };
  } catch (err) {
    console.warn("Supabase Auth sign-up warning:", err.message);
    return { data: null, error: err };
  }
};

/**
 * Helper to log in a user with Supabase Auth
 */
export const signInWithSupabase = async ({ email, password }) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;
    return { data, error: null };
  } catch (err) {
    console.warn("Supabase Auth sign-in warning:", err.message);
    return { data: null, error: err };
  }
};

/**
 * Helper to log out current user
 */
export const signOutSupabase = async () => {
  try {
    await supabase.auth.signOut();
  } catch (err) {
    console.warn("Supabase Auth sign-out error:", err);
  }
};

/**
 * Real-time subscription to applications table changes
 */
export const subscribeToApplications = (userId, onUpdate) => {
  const channel = supabase
    .channel(`realtime:applications:${userId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'loan_applications',
        filter: `user_id=eq.${userId}`
      },
      (payload) => {
        onUpdate(payload);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};

/**
 * Real-time subscription to notifications table changes
 */
export const subscribeToNotifications = (userId, onUpdate) => {
  const channel = supabase
    .channel(`realtime:notifications:${userId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${userId}`
      },
      (payload) => {
        onUpdate(payload.new);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};
