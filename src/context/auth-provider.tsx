'use client'

import { createContext, useState, useEffect, ReactNode } from 'react'
import type { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'

type AuthContextType = {
  user: User | null
  isDemoMode: boolean
  setDemoMode: (isDemo: boolean) => void
  loading: boolean
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const supabase = createClient()
  const [user, setUser] = useState<User | null>(null)
  const [isDemoMode, setIsDemoMode] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const demo = localStorage.getItem('isDemoMode') === 'true'
    setIsDemoMode(demo)

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    supabase.auth.getSession().then(({ data: { session } }) => {
        setUser(session?.user ?? null);
        setLoading(false);
    });

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase.auth])

  const setDemoMode = (isDemo: boolean) => {
    if (isDemo) {
      localStorage.setItem('isDemoMode', 'true')
    } else {
      localStorage.removeItem('isDemoMode')
    }
    setIsDemoMode(isDemo)
  }

  const value = {
    user,
    isDemoMode,
    setDemoMode,
    loading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
