import { supabase } from "@/lib/supabase"
import { ensureAuthenticatedSession } from "@/services/auth"

const MAX_FILE_SIZE = 5 * 1024 * 1024
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"]

export async function uploadMultipleImages(files: File[]) {
  const urls: string[] = []

  if (files.length === 0) {
    return urls
  }

  await ensureAuthenticatedSession()

  for (const file of files) {
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      throw new Error(`Arquivo "${file.name}" nao e uma imagem valida.`)
    }

    if (file.size > MAX_FILE_SIZE) {
      throw new Error(`Arquivo "${file.name}" ultrapassa o limite de 5MB.`)
    }

    const extension = file.name.split(".").pop()?.toLowerCase() || "jpg"
    const fileName = `${crypto.randomUUID()}.${extension}`

    const { error } = await supabase.storage
      .from("produtos")
      .upload(fileName, file)

    if (error) {
      throw new Error(`Erro ao enviar imagem para o Storage: ${error.message}`)
    }

    const { data } = supabase.storage
      .from("produtos")
      .getPublicUrl(fileName)

    urls.push(data.publicUrl)
  }

  return urls
}
