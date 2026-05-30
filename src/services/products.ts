import { supabase } from "@/lib/supabase"
import { isProductActive } from "@/lib/productStatus"
import type { Product } from "@/types/product"

export async function getProducts(): Promise<Product[]> {
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
    .order("nome", { ascending: true })

  if (error) {
    console.error(error)
    return []
  }

  return (data || []).filter((product) => isProductActive(product.status))
}
