import { ensureAuthenticatedSession } from "@/services/auth"
import { supabase } from "@/lib/supabase"
import type { AdminProduct } from "@/types/product"

export async function getAdminProducts(): Promise<AdminProduct[]> {
  await ensureAuthenticatedSession()

  const { data, error } = await supabase
    .from("produtos")
    .select(`
      id,
      nome,
      descricao,
      cores,
      categoria,
      mais_pedido,
      status,
      imagens (id, url, ordem)
    `)
    .order("created_at", { ascending: false })

  if (error) throw error

  return data
}
