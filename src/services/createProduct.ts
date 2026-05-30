import { supabase } from "@/lib/supabase"

type CreateProductInput = {
  nome: string
  descricao: string
  cores: string
  categoria: string
  maisPedido?: boolean
  images: string[]
}

export async function createProduct(data: CreateProductInput) {
  const { data: product, error } = await supabase
    .from("produtos")
    .insert({
      nome: data.nome,
      descricao: data.descricao,
      cores: data.cores || null,
      categoria: data.categoria || null,
      mais_pedido: data.maisPedido || false,
      status: true,
    })
    .select()
    .single()

  if (error) {
    throw new Error(`Erro ao criar produto: ${error.message}`)
  }

  if (data.images.length === 0) {
    return
  }

  const imagesToInsert = data.images.map((url, index) => ({
    produto_id: product.id,
    url,
    ordem: index,
  }))

  const { error: imgError } = await supabase
    .from("imagens")
    .insert(imagesToInsert)

  if (imgError) {
    throw new Error(`Erro ao salvar imagens do produto: ${imgError.message}`)
  }
}
