export function getErrorMessage(error: unknown, fallback = "Algo deu errado. Tente novamente.") {
  const normalizeMessage = (message: string) => {
    const lowerMessage = message.toLowerCase()

    if (lowerMessage.includes("row-level security") || lowerMessage.includes("rls")) {
      return "Não foi possível carregar os produtos. Por favor, tente novamente em alguns instantes."
    }

    if (lowerMessage.includes("bucket not found")) {
      return "Não foi possível carregar as imagens do produto. Por favor, tente novamente em alguns instantes."
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
