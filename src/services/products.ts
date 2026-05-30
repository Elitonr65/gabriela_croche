import { supabase } from "@/lib/supabase"
import { isProductActive } from "@/lib/productStatus"
import type { Product } from "@/types/product"

export async function getProducts(): Promise<Product[]> {
  // If the deployment sets NEXT_PUBLIC_HIDE_PRODUCTS=true, return an empty list.
  // Useful to keep the public site empty while the client seeds their own data.
  if (process.env.NEXT_PUBLIC_HIDE_PRODUCTS === "true") {
    return []
  }
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
