"use client"

import { useState } from "react"
import { Menu, X } from "lucide-react"

type CategoryDrawerProps = {
  categories: string[]
  selectedCategory: string
  onSelectCategory: (category: string) => void
  productCount?: number
}

export default function CategoryDrawer({
  categories,
  selectedCategory,
  onSelectCategory,
  productCount = 0,
}: CategoryDrawerProps) {
  const [isOpen, setIsOpen] = useState(false)

  const toggleDrawer = () => {
    setIsOpen(!isOpen)
  }

  const handleSelectCategory = (category: string) => {
    onSelectCategory(category)
    setIsOpen(false)
  }

  return (
    <div>
      {/* Drawer toggle button */}
      <button
        onClick={toggleDrawer}
        aria-label="Abrir menu de categorias"
        className="inline-flex items-center gap-2 rounded-lg border border-[var(--line)] bg-white px-4 py-3 text-sm font-black text-[var(--foreground)] transition-all duration-200 hover:bg-[var(--surface-muted)] md:hidden"
      >
        <Menu className="h-5 w-5 text-[var(--primary)]" />
        {selectedCategory === "all" ? "Todas" : selectedCategory}
      </button>

      {/* Desktop category buttons (always visible on md+) */}
      <div className="hidden gap-2 md:flex md:flex-wrap">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onSelectCategory(category)}
            className={`rounded-lg border px-4 py-3 text-sm font-black transition-all duration-200 ${
              selectedCategory === category
                ? "border-[var(--primary)] bg-[var(--primary)] text-white shadow-lg"
                : "border-[var(--line)] bg-white text-[var(--foreground)] hover:border-[var(--primary)] hover:bg-[var(--surface-muted)]"
            }`}
          >
            {category === "all" ? "Todas" : category}
          </button>
        ))}
      </div>

      {/* Mobile drawer overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile drawer sidebar */}
      <div
        className={`fixed left-0 top-0 z-40 h-screen w-72 bg-white shadow-2xl transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:hidden`}
      >
        <div className="flex h-16 items-center justify-between border-b border-[var(--line)] px-6">
          <h2 className="text-lg font-black text-[var(--foreground)]">Categorias</h2>
          <button
            onClick={() => setIsOpen(false)}
            aria-label="Fechar menu"
            className="text-[var(--muted)] transition-colors hover:text-[var(--foreground)]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-col gap-2 p-4">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleSelectCategory(category)}
              className={`rounded-lg border px-4 py-3 text-left font-black transition-all duration-200 ${
                selectedCategory === category
                  ? "border-[var(--primary)] bg-[var(--primary)] text-white shadow-md"
                  : "border-[var(--line)] bg-[var(--surface-muted)] text-[var(--foreground)] hover:border-[var(--primary)] hover:bg-white"
              }`}
            >
              {category === "all" ? "Todas as categorias" : category}
            </button>
          ))}
        </div>

        <div className="border-t border-[var(--line)] p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
            Total de produtos
          </p>
          <p className="mt-2 text-3xl font-black text-[var(--primary)]">
            {productCount}
          </p>
        </div>
      </div>
    </div>
  )
}
