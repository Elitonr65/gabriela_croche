export function getErrorMessage(error: unknown, fallback = "Algo deu errado. Tente novamente.") {
  const normalizeMessage = (message: string) => {
    const lowerMessage = message.toLowerCase()

    if (lowerMessage.includes("row-level security") || lowerMessage.includes("rls")) {
      return "Permissao bloqueada pelo Supabase (RLS). Execute scripts/supabase-policies.sql no SQL Editor do Supabase e tente novamente."
    }

    if (lowerMessage.includes("bucket not found")) {
      return "Bucket de imagens nao encontrado. Execute scripts/supabase-policies.sql para criar/ajustar o bucket produtos."
    }

    return message
  }

  if (error instanceof Error) {
    return normalizeMessage(error.message)
  }

  if (typeof error === "string") {
    return normalizeMessage(error)
  }

  if (error && typeof error === "object" && "message" in error) {
    const message = (error as { message?: unknown }).message

    if (typeof message === "string") {
      return normalizeMessage(message)
    }
  }

  return fallback
}
