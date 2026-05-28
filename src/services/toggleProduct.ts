import { supabase } from "@/lib/supabase"
import { isProductActive, toWritableProductStatus } from "@/lib/productStatus"
import type { ProductStatus } from "@/types/product"

export async function toggleProduct(id: string): Promise<{ id: string; status: ProductStatus }> {
  const { data, error } = await supabase
    .from("produtos")
    .select("status")
    .eq("id", id)
    .single()

  if (error) throw error

  const nextStatus = !isProductActive(data.status)
  const writableStatus = toWritableProductStatus(data.status, nextStatus)

  const { count, error: updateError } = await supabase
    .from("produtos")
    .update({ status: writableStatus }, { count: "exact" })
    .eq("id", id)

  if (updateError) throw updateError

  if (count === 0) {
    throw new Error("Produto nao encontrado ou sem permissao para alterar.")
  }

  return {
    id,
    status: writableStatus,
  }
}
