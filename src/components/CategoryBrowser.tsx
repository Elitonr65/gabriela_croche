"use client"

import { Heart } from "lucide-react"

type CategoryConfig = {
  color: string
  bgGradient: string
}

const categoryStyles: Record<string, CategoryConfig> = {
  all: {
    color: "text-[var(--primary)]",
    bgGradient: "from-[var(--primary)]/10 to-transparent",
  },
  "sousplats": {
    color: "text-fuchsia-600",
    bgGradient: "from-fuchsia-600/10 to-transparent",
  },
  "trilhos de mesa": {
    color: "text-amber-600",
    bgGradient: "from-amber-600/10 to-transparent",
  },
  "caminhos de mesa": {
    color: "text-cyan-600",
    bgGradient: "from-cyan-600/10 to-transparent",
  },
  "porta-copos": {
    color: "text-orange-600",
    bgGradient: "from-orange-600/10 to-transparent",
  },
  "descanso de panela": {
    color: "text-emerald-600",
    bgGradient: "from-emerald-600/10 to-transparent",
  },
  "porta guardanapo": {
    color: "text-rose-600",
    bgGradient: "from-rose-600/10 to-transparent",
  },
  "itens de decoração": {
    color: "text-indigo-600",
    bgGradient: "from-indigo-600/10 to-transparent",
  },
}

function getCategoryStyle(category: string): CategoryConfig {
  const normalized = category.toLowerCase().trim()
  return categoryStyles[normalized] || {
    color: "text-[var(--primary)]",
    bgGradient: "from-[var(--primary)]/10 to-transparent",
  }
}

type CategoryBrowserProps = {
  categories: string[]
  selectedCategory: string
  onSelectCategory: (category: string) => void
}

export default function CategoryBrowser({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryBrowserProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {categories.map((category) => {
        const config = getCategoryStyle(category)
        const displayName = category === "all" ? "Todas" : category.charAt(0).toUpperCase() + category.slice(1)
        const isSelected = selectedCategory === category

        return (
          <button
            key={category}
            onClick={() => onSelectCategory(category)}
            className={`group flex items-center gap-3 rounded-3xl border px-4 py-4 text-left transition-all duration-200 ${
              isSelected
                ? `border-[var(--primary)] bg-gradient-to-br ${config.bgGradient} shadow-lg`
                : `border border-[var(--line)] bg-white hover:border-[var(--primary)] hover:bg-gradient-to-br ${config.bgGradient}`
            }`}
          >
            <Heart className={`h-5 w-5 ${config.color}`} />
            <span className={`text-sm font-bold uppercase tracking-[0.18em] ${isSelected ? "text-[var(--primary)]" : "text-[var(--foreground)]"}`}>
              {displayName}
            </span>
          </button>
        )
      })}
    </div>
  )
}
