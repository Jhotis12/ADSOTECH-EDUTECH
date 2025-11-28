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

export const isConfigured = projectUrl && anonKey && isValidUrl(projectUrl);

export const supabase = createClient(
  projectUrl || 'https://placeholder.supabase.co',
  anonKey || 'placeholder'
);

if (!isConfigured) {
  console.warn('Supabase no configurado. verificar .env.');
}
