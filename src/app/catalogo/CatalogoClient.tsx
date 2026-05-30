"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { ArrowRight, PackageSearch, Palette, Search, X } from "lucide-react"
import SafeImage from "@/components/SafeImage"
import CategoryBrowser from "@/components/CategoryBrowser"
import type { Product } from "@/types/product"

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

function getColorList(cores: string | null) {
  return cores
    ? cores.split(",").map((cor) => cor.trim()).filter(Boolean)
    : []
}

function getColorHex(colorName: string): string {
  const normalized = colorName.toLowerCase().trim()
  return colorMap[normalized] || "#9ca3af"
}

export default function CatalogoClient({
  products,
}: {
  products: Product[]
}) {
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const categories = useMemo(() => {
    const values = products
      .map((product) => product.categoria?.trim())
      .filter((categoria): categoria is string => Boolean(categoria))
    const uniqueCategories = Array.from(new Set(values)).sort((a, b) => a.localeCompare(b, "pt-BR", { sensitivity: "base" }))
    return ["all", ...uniqueCategories]
  }, [products])

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase()

    return products.filter((product) => {
      const name = product.nome.toLowerCase()
      const description = product.descricao?.toLowerCase() || ""
      const category = (product.categoria || "").trim().toLowerCase()

      const matchesQuery = !query || name.includes(query) || description.includes(query)
      const matchesCategory = selectedCategory === "all" || category === selectedCategory.toLowerCase()

      return matchesQuery && matchesCategory
    })
  }, [products, search, selectedCategory])

  return (
    <div className="app-container py-8">
      <section className="card p-6">
        <div className="grid gap-5 md:grid-cols-[1fr_18rem] md:items-end">
          <div>
            <p className="brand-kicker">
              <PackageSearch className="h-4 w-4" />
              Catálogo
            </p>
            <h1 className="mt-2 text-4xl font-black text-[var(--foreground)]">
              Produtos disponíveis
            </h1>
            <p className="mt-2 text-base leading-7 text-[var(--muted)]">
              Busque uma peça, abra os detalhes e chame no WhatsApp.
            </p>
          </div>

          <div className="rounded-lg border border-[var(--line)] bg-[var(--surface-muted)] p-4">
            <p className="text-3xl font-black text-[var(--primary)]">{filteredProducts.length}</p>
            <p className="text-sm font-semibold text-[var(--muted)]">resultado(s)</p>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <label className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--primary)]" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar por nome ou descrição"
              className="field px-12 py-3 text-base"
            />
          </label>
          {search && (
            <button onClick={() => setSearch("")} className="btn-secondary">
              <X className="h-5 w-5" />
              Limpar
            </button>
          )}
        </div>

        <div className="mt-6">
          <p className="mb-4 text-sm font-black uppercase tracking-[0.2em] text-[var(--muted)]">
            Filtrar por categoria
          </p>
          <CategoryBrowser
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </div>
      </section>

      <section className="mt-6">
        {products.length === 0 && (
          <div className="card p-8 text-center">
            <p className="text-xl font-black text-[var(--foreground)]">Nenhum produto público encontrado</p>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-[var(--muted)]">
              Se existem produtos ativos no admin, execute o arquivo scripts/supabase-policies.sql no SQL Editor do Supabase.
            </p>
          </div>
        )}

        {products.length > 0 && filteredProducts.length === 0 && (
          <div className="card p-8 text-center">
            <p className="text-xl font-black text-[var(--foreground)]">Nenhum resultado para a busca</p>
            <p className="mt-2 text-sm text-[var(--muted)]">Tente outro termo.</p>
          </div>
        )}

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product, index) => {
            const coresList = getColorList(product.cores)

            return (
              <Link
                key={product.id}
                href={`/produto/${product.id}`}
                className="card group overflow-hidden hover:border-[#e6b5d4]"
              >
                <div className="relative h-64 bg-[var(--surface-muted)]">
                  <SafeImage
                    src={product.imagens?.[0]?.url}
                    alt={`Foto de ${product.nome}`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    priority={index === 0}
                  />
                </div>

                <div className="p-5">
                  <h2 className="text-xl font-black text-[var(--foreground)]">{product.nome}</h2>
                  {product.categoria && (
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--primary)]">
                      {product.categoria}
                    </p>
                  )}
                  <p className="mt-2 line-clamp-2 min-h-[3rem] text-sm leading-6 text-[var(--muted)]">
                    {product.descricao || "Produto cadastrado no catálogo."}
                  </p>

                  {coresList.length > 0 && (
                    <div className="mt-4 flex items-center gap-2">
                      <Palette className="h-4 w-4 text-[var(--primary)]" />
                      <div className="flex flex-wrap gap-1.5">
                        {coresList.slice(0, 5).map((cor) => (
                          <span
                            key={cor}
                            title={cor}
                            className="h-4 w-4 rounded-full border border-white shadow-sm"
                            style={{ backgroundColor: getColorHex(cor) }}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-4 flex items-center justify-between border-t border-[var(--line)] pt-4 text-sm font-black text-[var(--primary)]">
                    Ver detalhes
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </section>
    </div>
  )
}
