'use client'

import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  if (!supabaseUrl || supabaseUrl.includes('your-project-url')) {
    throw new Error('Missing Supabase URL. Did you forget to update .env.local with your project credentials?')
  }

  if (!supabaseAnonKey || supabaseAnonKey.includes('your-anon-key')) {
    throw new Error('Missing Supabase Anon Key. Did you forget to update .env.local with your project credentials?')
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}
