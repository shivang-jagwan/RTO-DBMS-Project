'use server'

import { z } from 'zod'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

const signupSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email(),
  password: z.string().min(6),
})

export async function signup(values: z.infer<typeof signupSchema>) {
  const supabase = createClient()
  
  const { error } = await supabase.auth.signUp({
    email: values.email,
    password: values.password,
    options: {
      data: {
        full_name: values.name,
      },
    },
  })

  if (error) {
    return error.message
  }

  return null
}

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export async function login(values: z.infer<typeof loginSchema>) {
  const supabase = createClient()
  
  const { error } = await supabase.auth.signInWithPassword({
    email: values.email,
    password: values.password,
  })

  if (error) {
    return error.message
  }

  return null
}

export async function logout() {
  const supabase = createClient()
  await supabase.auth.signOut()
}
