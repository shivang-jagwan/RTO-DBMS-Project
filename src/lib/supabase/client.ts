import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  if (!supabaseUrl || supabaseUrl.includes('YOUR_SUPABASE_URL') || !supabaseUrl.startsWith('http')) {
    throw new Error('Missing Supabase URL. Please update your .env.local file.')
  }

  if (!supabaseAnonKey || supabaseAnonKey.includes('YOUR_SUPABASE_ANON_KEY')) {
    throw new Error('Missing Supabase Anon Key. Please update your .env.local file.')
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}
