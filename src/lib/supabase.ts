import { createClient } from '@supabase/supabase-js';

export const projectUrl = import.meta.env.VITE_SUPABASE_URL;
export const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const isConfigured = projectUrl && anonKey && isValidUrl(projectUrl) && projectUrl !== 'https://pkygbdtvtdhytkhficyd.supabase.co';

export const supabase = isConfigured
  ? createClient(projectUrl, anonKey)
  : createClient('https://placeholder.supabase.co', 'placeholder');

if (!isConfigured) {
  console.warn('Supabase not configured. Using placeholder client.');
}
