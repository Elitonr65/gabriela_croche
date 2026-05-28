import { supabase } from "@/lib/supabase"

export async function addImagesToProduct(productId: string, urls: string[]) {
  if (urls.length === 0) return

  const { data: existing } = await supabase
    .from("imagens")
    .select("ordem")
    .eq("produto_id", productId)
    .order("ordem", { ascending: false })
    .limit(1)

  const startOrder = existing && existing.length > 0 ? (existing[0].ordem || 0) + 1 : 0

  const imagesToInsert = urls.map((url, index) => ({
    produto_id: productId,
    url,
    ordem: startOrder + index,
  }))

  const { error } = await supabase
    .from("imagens")
    .insert(imagesToInsert)

  if (error) {
    throw new Error(`Erro ao adicionar imagens: ${error.message}`)
  }
}
