"use client"

import { useState } from "react"
import { CheckCircle2, Heart, MessageCircle, Palette, ShieldCheck } from "lucide-react"
import { generateWhatsAppLink } from "@/lib/whatsapp"

type ProductSidebarProps = {
  nome: string
  descricao: string | null
  cores: string | null
  imagemUrl: string | null
}

const colorMap: Record<string, string> = {
  // Reds & Pinks
  vermelho: "#dc2626",
  vermellho: "#dc2626",
  red: "#dc2626",
  rosa: "#ec4899",
  pink: "#ec4899",
  claro: "#fce7f3",
  light: "#fce7f3",
  palido: "#f472b6",
  pale: "#f472b6",
  // Blues
  azul: "#3b82f6",
  blue: "#3b82f6",
  "azul claro": "#93c5fd",
  "light blue": "#93c5fd",
  ceu: "#0ea5e9",
  sky: "#0ea5e9",
  // Purples & Violets
  roxo: "#a855f7",
  purple: "#a855f7",
  violeta: "#7c3aed",
  violet: "#7c3aed",
  lilas: "#d8b4fe",
  lilac: "#d8b4fe",
  // Yellows & Golds
  amarelo: "#fbbf24",
  yellow: "#fbbf24",
  ouro: "#f59e0b",
  gold: "#f59e0b",
  dourado: "#f59e0b",
  // Greens
  verde: "#22c55e",
  green: "#22c55e",
  esmeralda: "#10b981",
  emerald: "#10b981",
  menta: "#6ee7b7",
  mint: "#6ee7b7",
  // Neutrals
  branco: "#ffffff",
  white: "#ffffff",
  preto: "#000000",
  black: "#000000",
  cinza: "#6b7280",
  gray: "#6b7280",
  bege: "#c2a878",
  beige: "#c2a878",
  marrom: "#92400e",
  brown: "#92400e",
  creme: "#fffbeb",
  cream: "#fffbeb",
  // Neutral shades
  natural: "#c2a878",
  ecru: "#c2a878",
}

function getColorHex(colorName: string): string {
  const normalized = colorName.toLowerCase().trim()
  return colorMap[normalized] || "#9ca3af"
}

export default function ProductSidebar({ nome, descricao, cores, imagemUrl }: ProductSidebarProps) {
  const coresList = cores
    ? cores.split(",").map((c) => c.trim()).filter(Boolean)
    : []

  const [selectedCor, setSelectedCor] = useState<string | null>(null)

  const whatsappLink = generateWhatsAppLink({
    nomeProduto: nome,
    cor: selectedCor || undefined,
    imagemUrl: imagemUrl || undefined,
  })

  return (
    <aside className="card h-fit p-6">
      <span className="badge badge-success gap-2">
        <CheckCircle2 className="h-4 w-4" />
        Disponível sob consulta
      </span>

      <h1 className="mt-4 text-4xl font-black leading-tight text-[var(--foreground)]">
        {nome}
      </h1>

      <p className="mt-4 text-base leading-8 text-[var(--muted)]">
        {descricao || "Produto cadastrado no catálogo."}
      </p>

      {coresList.length > 0 && (
        <div className="mt-5">
          <p className="inline-flex items-center gap-2 text-sm font-bold text-[var(--foreground)]">
            <Palette className="h-4 w-4 text-[var(--primary)]" />
            Escolha a cor
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {coresList.map((cor) => (
              <button
                key={cor}
                type="button"
                onClick={() => setSelectedCor(selectedCor === cor ? null : cor)}
                className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-bold transition-all ${
                  selectedCor === cor
                    ? "border-[var(--primary)] bg-[var(--primary)] text-white"
                    : "border-[var(--line)] bg-white text-[var(--foreground)] hover:border-[#e6b5d4] hover:bg-[var(--surface-muted)]"
                }`}
              >
                <span
                  className="h-3 w-3 rounded-full border border-white/80 shadow-sm"
                  style={{ backgroundColor: getColorHex(cor) }}
                />
                {cor}
              </button>
            ))}
          </div>
          {selectedCor && (
            <p className="mt-2 text-sm font-semibold text-[var(--muted)]">
              Selecionada: <span className="font-black text-[var(--foreground)]">{selectedCor}</span>
            </p>
          )}
        </div>
      )}

      <div className="my-6 border-y border-[var(--line)] py-5">
        <p className="inline-flex items-center gap-2 text-sm font-bold text-[var(--primary)]">
          <MessageCircle className="h-4 w-4" />
          Atendimento
        </p>
        <p className="mt-1 text-base font-semibold text-[var(--foreground)]">
          Tire dúvidas, consulte cores e combine disponibilidade pelo WhatsApp.
        </p>
      </div>

      <div className="mb-5 grid gap-3 rounded-lg border border-[var(--line)] bg-[var(--surface-muted)] p-4 text-sm font-semibold text-[var(--foreground)]">
        <p className="inline-flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-[var(--accent)]" />
          Produção artesanal com cuidado no acabamento
        </p>
        <p className="inline-flex items-center gap-2">
          <Heart className="h-4 w-4 text-[var(--primary)]" />
          Cuidados de conservação enviados após a compra
        </p>
      </div>

      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-primary w-full"
      >
        <MessageCircle className="h-5 w-5" />
        Chamar no WhatsApp
      </a>

      {selectedCor && (
        <p className="mt-3 text-center text-xs text-[var(--muted)]">
          A cor &quot;{selectedCor}&quot; será informada na mensagem.
        </p>
      )}
    </aside>
  )
}
