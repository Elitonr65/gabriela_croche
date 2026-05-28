import { supabase } from "@/lib/supabase"

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) throw error

  if (!data.session) {
    throw new Error("Login sem sessao.")
  }
}

export async function signOut() {
  await supabase.auth.signOut()
}

export async function ensureAuthenticatedSession() {
  const { data, error } = await supabase.auth.getSession()

  if (error) throw error

  if (!data.session) {
    throw new Error("Sessao expirada. Entre novamente antes de salvar o produto.")
  }

  return data.session
}
