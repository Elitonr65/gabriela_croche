import { supabase } from "@/lib/supabase"
import { toWritableProductStatus } from "@/lib/productStatus"
import type { ProductStatus } from "@/types/product"

export async function updateProduct(id: string, data: {
  nome: string
  descricao: string
  cores: string
  categoria: string
  status: boolean
  maisPedido?: boolean
}) {
  const { data: currentProduct, error: currentError } = await supabase
    .from("produtos")
    .select("status")
    .eq("id", id)
    .single()

  if (currentError) throw currentError

  const status = toWritableProductStatus(currentProduct.status as ProductStatus, data.status)

  const { count, error } = await supabase
    .from("produtos")
    .update(
      {
        nome: data.nome,
        descricao: data.descricao,
        cores: data.cores || null,
        categoria: data.categoria || null,
        mais_pedido: data.maisPedido === true,
        status,
      },
      { count: "exact" }
    )
    .eq("id", id)

  if (error) throw error

  if (count === 0) {
    throw new Error("Produto nao encontrado ou sem permissao para atualizar.")
  }
}
