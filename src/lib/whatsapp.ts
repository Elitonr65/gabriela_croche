const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "5569992845908"

export const CARE_INSTRUCTIONS_MESSAGE = [
  "Cuidados com suas peças de Crochê",
  "Não lave na máquina de lavar;",
  "Mantenha longe da luz direta do sol ao secar;",
  "Dissolva bem o sabão em água fria e lave suas peças à mão, sem torcer excessivamente;",
  "Evite pendurar no varal; espalhe as peças na horizontal para secar, assim elas não deformam;",
  "Dobre suas peças para guardar, evitando manter em cabides para que não laceiem.",
  "Agradecemos por fazer parte da nossa história. ♥",
].join("\n")

type WhatsAppOptions = {
  nomeProduto: string
  cor?: string
  imagemUrl?: string
  productUrl?: string
}

export function generateWhatsAppLink({ nomeProduto, cor, imagemUrl, productUrl }: WhatsAppOptions) {
  let mensagem = `Ola! Tenho interesse no produto: *${nomeProduto}*`

  if (cor) {
    mensagem += `\nCor escolhida: *${cor}*`
  }

  mensagem += `\nVoce ainda tem disponivel?`

  // Preferir link para a página do produto (melhor preview no WhatsApp).
  if (productUrl) {
    mensagem += `\n\nVeja o produto: ${productUrl}`
  } else if (imagemUrl) {
    mensagem += `\n\nFoto do produto: ${imagemUrl}`
  }

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensagem)}`
}

export function generateCareInstructionsWhatsAppLink() {
  return `https://api.whatsapp.com/send?text=${encodeURIComponent(CARE_INSTRUCTIONS_MESSAGE)}`
}
