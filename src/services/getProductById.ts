import { supabase } from "@/lib/supabase"
import { isProductActive } from "@/lib/productStatus"
import type { Product } from "@/types/product"

export async function getProductById(id: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from("produtos")
    .select(`
      id,
      nome,
      descricao,
      cores,
      status,
      imagens (id, url, ordem)
    `)
    .eq("id", id)
    .maybeSingle()

  if (error) throw error

  if (!data || !isProductActive(data.status)) {
    return null
  }

  return data
}
