import { supabase } from "@/lib/supabase"
import type { ProductImage } from "@/types/product"

export async function deleteProduct(id: string) {
  const { data, error: fetchError } = await supabase
    .from("produtos")
    .select(`
      imagens (url)
    `)
    .eq("id", id)
    .maybeSingle()

  if (fetchError) throw fetchError

  const images = (data?.imagens || []) as ProductImage[]
  const storagePaths = images
    .map((image) => getStoragePathFromPublicUrl(image.url))
    .filter((path): path is string => Boolean(path))

  if (storagePaths.length > 0) {
    const { error: storageError } = await supabase.storage
      .from("produtos")
      .remove(storagePaths)

    if (storageError) {
      console.warn("Nao foi possivel remover imagens do Storage.", storageError)
    }
  }

  const { count, error } = await supabase
    .from("produtos")
    .delete({ count: "exact" })
    .eq("id", id)

  if (error) {
    console.error(error)
    throw error
  }

  if (count === 0) {
    throw new Error("Produto nao encontrado ou sem permissao para deletar.")
  }
}

function getStoragePathFromPublicUrl(url: string) {
  const marker = "/storage/v1/object/public/produtos/"
  const markerIndex = url.indexOf(marker)

  if (markerIndex === -1) {
    return null
  }

  const path = url.slice(markerIndex + marker.length).split("?")[0]

  return decodeURIComponent(path)
}
