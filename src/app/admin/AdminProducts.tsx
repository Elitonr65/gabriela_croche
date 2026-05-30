"use client"

import { useEffect, useMemo, useState } from "react"
import {
  ClipboardCheck,
  Edit3,
  Menu,
  Power,
  RefreshCw,
  Search,
  Send,
  Trash2,
} from "lucide-react"
import AdminSkeleton from "@/components/AdminSkeleton"
import SafeImage from "@/components/SafeImage"
import CategoryBrowser from "@/components/CategoryBrowser"
import { getErrorMessage } from "@/lib/errors"
import { isProductActive } from "@/lib/productStatus"
import { CARE_INSTRUCTIONS_MESSAGE, generateCareInstructionsWhatsAppLink } from "@/lib/whatsapp"
import { ensureAuthenticatedSession } from "@/services/auth"
import { getAdminProducts } from "@/services/getAdminProducts"
import { deleteProduct } from "@/services/deleteProduct"
import { toggleProduct } from "@/services/toggleProduct"
import { updateProduct } from "@/services/updateProduct"
import { uploadMultipleImages } from "@/services/uploadMultipleImages"
import { addImagesToProduct } from "@/services/addImagesToProduct"
import type { AdminProduct, ProductFormData } from "@/types/product"

type StatusFilter = "all" | "active" | "inactive"

export default function AdminProducts() {
  const [products, setProducts] = useState<AdminProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null)
  const [query, setQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [showCategoryMenu, setShowCategoryMenu] = useState(false)
  const [formData, setFormData] = useState<ProductFormData>({
    nome: "",
    descricao: "",
    cores: "",
    categoria: "",
    status: true,
  })
  const [editFiles, setEditFiles] = useState<File[]>([])
  const [editPreviewUrls, setEditPreviewUrls] = useState<string[]>([])
  const [editFileInputKey, setEditFileInputKey] = useState(0)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const careInstructionsLink = generateCareInstructionsWhatsAppLink()

  const activeCount = useMemo(
    () => products.filter((product) => isProductActive(product.status)).length,
    [products]
  )

  const categories = useMemo(() => {
    const values = products
      .map((product) => product.categoria?.trim())
      .filter((categoria): categoria is string => Boolean(categoria))
    const uniqueCategories = Array.from(new Set(values)).sort((a, b) => a.localeCompare(b, "pt-BR", { sensitivity: "base" }))

    return ["all", ...uniqueCategories]
  }, [products])

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return products.filter((product) => {
      const matchesQuery =
        !normalizedQuery ||
        product.nome.toLowerCase().includes(normalizedQuery) ||
        (product.descricao || "").toLowerCase().includes(normalizedQuery)

      const active = isProductActive(product.status)
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && active) ||
        (statusFilter === "inactive" && !active)

      const normalizedCategory = (product.categoria || "").trim().toLowerCase()
      const matchesCategory =
        selectedCategory === "all" || normalizedCategory === selectedCategory.toLowerCase()

      return matchesQuery && matchesStatus && matchesCategory
    })
  }, [products, query, statusFilter, selectedCategory])

  async function loadProducts(showLoading = true) {
    if (showLoading) {
      setLoading(true)
    }

    try {
      const data = await getAdminProducts()
      setProducts(data || [])
    } catch (error) {
      setMessage({ type: "error", text: getErrorMessage(error, "Erro ao carregar produtos.") })
    } finally {
      if (showLoading) {
        setLoading(false)
      }
    }
  }

  function startEdit(product: AdminProduct) {
    setEditingProduct(product)
    setFormData({
      nome: product.nome,
      descricao: product.descricao || "",
      cores: product.cores || "",
      categoria: product.categoria || "",
      maisPedido: product.mais_pedido === true || product.maisPedido === true,
      status: isProductActive(product.status),
    })
    setEditFiles([])
    setEditPreviewUrls([])
    setEditFileInputKey((current) => current + 1)
    setMessage(null)

    window.setTimeout(() => {
      document.getElementById("edit-product-form")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }, 0)
  }

  async function handleToggle(product: AdminProduct) {
    setActionLoading(product.id)
    setMessage(null)

    try {
      const updatedProduct = await toggleProduct(product.id)
      setProducts((currentProducts) =>
        currentProducts.map((currentProduct) =>
          currentProduct.id === product.id
            ? { ...currentProduct, status: updatedProduct.status }
            : currentProduct
        )
      )
      setMessage({ type: "success", text: "Status atualizado com sucesso." })
    } catch (error) {
      setMessage({ type: "error", text: getErrorMessage(error, "Erro ao atualizar status.") })
    } finally {
      setActionLoading(null)
    }
  }

  async function handleDelete(product: AdminProduct) {
    const confirmed = window.confirm(`Deseja excluir "${product.nome}"? Essa acao nao pode ser desfeita.`)

    if (!confirmed) {
      return
    }

    setActionLoading(product.id)
    setMessage(null)

    try {
      await deleteProduct(product.id)
      setProducts((currentProducts) =>
        currentProducts.filter((currentProduct) => currentProduct.id !== product.id)
      )
      if (editingProduct?.id === product.id) {
        setEditingProduct(null)
      }
      setMessage({ type: "success", text: "Produto excluido com sucesso." })
    } catch (error) {
      setMessage({ type: "error", text: getErrorMessage(error, "Erro ao excluir produto.") })
    } finally {
      setActionLoading(null)
    }
  }

  async function handleUpdate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!editingProduct) {
      return
    }

    if (!formData.nome.trim()) {
      setMessage({ type: "error", text: "Informe o nome do produto." })
      return
    }

    setActionLoading(editingProduct.id)
    setMessage(null)

    try {
      await ensureAuthenticatedSession()
      await updateProduct(editingProduct.id, formData)

      if (editFiles.length > 0) {
        const urls = await uploadMultipleImages(editFiles)
        await addImagesToProduct(editingProduct.id, urls)
      }

      setEditingProduct(null)
      setEditFiles([])
      setEditPreviewUrls([])
      await loadProducts(false)
      setMessage({ type: "success", text: "Produto atualizado com sucesso." })
    } catch (error) {
      setMessage({ type: "error", text: getErrorMessage(error, "Erro ao atualizar produto.") })
    } finally {
      setActionLoading(null)
    }
  }

  useEffect(() => {
    let active = true

    getAdminProducts()
      .then((data) => {
        if (active) {
          setProducts(data || [])
        }
      })
      .catch((error) => {
        if (active) {
          setMessage({ type: "error", text: getErrorMessage(error, "Erro ao carregar produtos.") })
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false)
        }
      })

    return () => {
      active = false
    }
  }, [])

  const filterButtonClass = (target: StatusFilter) =>
    `rounded-lg border px-4 py-3 text-sm font-black ${
      statusFilter === target
        ? "border-[var(--primary)] bg-[var(--primary)] text-white"
        : "border-[var(--line)] bg-white text-[var(--foreground)] hover:bg-[var(--surface-muted)]"
    }`

  return (
    <div className="grid gap-5">
      <section className="card p-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="brand-kicker">Catálogo</p>
            <h1 className="mt-1 text-4xl font-black text-[var(--foreground)]">Produtos</h1>
            <p className="mt-2 text-base text-[var(--muted)]">
              {products.length} cadastrados, {activeCount} ativos no catálogo público.
            </p>
          </div>

          <button
            type="button"
            onClick={() => loadProducts()}
            disabled={loading}
            className="btn-secondary"
          >
            <RefreshCw className="h-5 w-5" />
            Atualizar lista
          </button>
        </div>

        <div className="mt-5 grid gap-4 rounded-lg border border-[var(--line)] bg-[var(--surface-muted)] p-4 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="inline-flex items-center gap-2 text-sm font-black text-[var(--primary)]">
              <ClipboardCheck className="h-4 w-4" />
              Mensagem pós-compra
            </p>
            <p className="mt-1 text-sm leading-6 text-[var(--muted)]">
              O botão envia as instruções de cuidado para o cliente pelo WhatsApp.
            </p>
            <p className="mt-2 line-clamp-2 text-xs font-semibold leading-5 text-[var(--foreground)]">
              {CARE_INSTRUCTIONS_MESSAGE}
            </p>
          </div>
          <a
            href={careInstructionsLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-accent w-full lg:w-fit"
          >
            <Send className="h-5 w-5" />
            Enviar mensagem padrão
          </a>
        </div>

<div className="mt-6 grid gap-3">
          <div className="grid gap-3 lg:grid-cols-[1fr_auto] items-start">
            <label className="relative min-w-0">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--primary)]" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Buscar produto"
                className="field w-full min-w-0 px-12 py-3 text-base"
              />
            </label>

            <div className="grid min-w-0 grid-cols-3 gap-2">
              <button type="button" onClick={() => setStatusFilter("all")} className={filterButtonClass("all")}> 
                Todos
              </button>
              <button type="button" onClick={() => setStatusFilter("active")} className={filterButtonClass("active")}> 
                Ativos
              </button>
              <button type="button" onClick={() => setStatusFilter("inactive")} className={filterButtonClass("inactive")}> 
                Inativos
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={() => setShowCategoryMenu((current) => !current)}
              className="btn-secondary inline-flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              <Menu className="h-4 w-4" />
              Categorias
            </button>

            <p className="text-sm text-[var(--muted)]">
              Categoria atual: <span className="font-black text-[var(--foreground)]">{selectedCategory === "all" ? "Todas" : selectedCategory}</span>
            </p>
          </div>

          {showCategoryMenu && (
            <div className="rounded-3xl border border-[var(--line)] bg-white p-4 shadow-sm">
              <CategoryBrowser
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={(category) => {
                  setSelectedCategory(category)
                  setShowCategoryMenu(false)
                }}
              />
            </div>
          )}
        </div>
      </section>

      {message && (
        <p
          role="status"
          aria-live="polite"
          className={`${message.type === "success" ? "message-success" : "message-error"} text-sm`}>
          {message.text}
        </p>
      )}

      {editingProduct && (
        <form id="edit-product-form" onSubmit={handleUpdate} className="card p-6">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="brand-kicker">Edição</p>
              <h2 className="mt-1 text-2xl font-black text-[var(--foreground)]">Editar produto</h2>
            </div>
            <button
              type="button"
              onClick={() => setEditingProduct(null)}
              className="btn-secondary"
            >
              Fechar
            </button>
          </div>

          <div className="grid gap-4">
            <input
              value={formData.nome}
              onChange={(event) => setFormData((current) => ({ ...current, nome: event.target.value }))}
              placeholder="Nome do produto"
              className="field px-4 py-3 text-base"
              required
            />

            <textarea
              value={formData.descricao}
              onChange={(event) =>
                setFormData((current) => ({ ...current, descricao: event.target.value }))
              }
              placeholder="Descricao"
              className="field min-h-32 px-4 py-3 text-base"
            />

            <div>
              <label className="block text-sm font-bold text-[var(--foreground)]">Categoria</label>
              <select
                value={formData.categoria}
                onChange={(event) =>
                  setFormData((current) => ({ ...current, categoria: event.target.value }))
                }
                className="field mt-2 px-4 py-3 text-base"
              >
                <option value="">Nenhuma</option>
                <option value="Sousplats">Sousplats</option>
                <option value="Trilhos de mesa">Trilhos de mesa</option>
                <option value="Caminhos de mesa">Caminhos de mesa</option>
                <option value="Porta-copos">Porta-copos</option>
                <option value="Descanso de panela">Descanso de panela</option>
                <option value="Porta guardanapo">Porta guardanapo</option>
                <option value="Itens de Decoração">Itens de Decoração</option>
              </select>
              <p className="mt-2 text-sm text-[var(--muted)]">Categoria é opcional e facilita a organização do catálogo.</p>
            </div>

            <div>
              <label className="block text-sm font-bold text-[var(--foreground)]">Cores disponíveis</label>
              <input
                value={formData.cores}
                onChange={(event) =>
                  setFormData((current) => ({ ...current, cores: event.target.value }))
                }
                placeholder="Ex: Rosa, Azul, Verde, Bege (separe por virgula)"
                className="field mt-2 px-4 py-3 text-base"
              />
            </div>

            <label className="flex items-center gap-3 rounded-lg border border-[var(--line)] bg-[var(--surface-muted)] px-4 py-3 text-base font-bold text-[var(--foreground)]">
              <input
                type="checkbox"
                checked={formData.status}
                onChange={(event) =>
                  setFormData((current) => ({ ...current, status: event.target.checked }))
                }
                className="h-5 w-5"
              />
              Produto ativo no catalogo
            </label>

            <label className="flex items-center gap-3 rounded-lg border border-[var(--line)] bg-[var(--surface-muted)] px-4 py-3 text-base font-bold text-[var(--foreground)]">
              <input
                type="checkbox"
                checked={!!formData.maisPedido}
                onChange={(event) =>
                  setFormData((current) => ({ ...current, maisPedido: event.target.checked }))
                }
                className="h-5 w-5"
              />
              Marcar como &quot;Mais pedido&quot;
            </label>

            {editingProduct.imagens && editingProduct.imagens.length > 0 && (
              <div>
                <p className="text-sm font-bold text-[var(--foreground)]">Fotos atuais</p>
                <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {editingProduct.imagens.map((img, index) => (
                    <div
                      key={img.url}
                      className="relative h-24 overflow-hidden rounded-lg border border-[var(--line)] bg-[var(--surface-muted)]"
                    >
                      <SafeImage
                        src={img.url}
                        alt={`Foto ${index + 1}`}
                        fill
                        sizes="96px"
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-[var(--foreground)]">Adicionar novas fotos</label>
              <input
                key={editFileInputKey}
                type="file"
                multiple
                accept="image/png,image/jpeg,image/webp,image/gif"
                className="field mt-2 cursor-pointer border-dashed px-4 py-4 text-base font-semibold text-[var(--foreground)]"
                onChange={(event) => {
                  editPreviewUrls.forEach((url) => URL.revokeObjectURL(url))
                  const selected = Array.from(event.target.files || [])
                  setEditFiles(selected)
                  setEditPreviewUrls(selected.map((f) => URL.createObjectURL(f)))
                }}
              />
              <p className="mt-1 text-sm text-[var(--muted)]">As novas fotos serão adicionadas junto com as existentes.</p>
            </div>

            {editPreviewUrls.length > 0 && (
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-sm font-bold text-[var(--foreground)]">{editPreviewUrls.length} nova(s) foto(s)</p>
                  <button
                    type="button"
                    onClick={() => {
                      editPreviewUrls.forEach((url) => URL.revokeObjectURL(url))
                      setEditFiles([])
                      setEditPreviewUrls([])
                      setEditFileInputKey((c) => c + 1)
                    }}
                    className="btn-secondary px-3 py-1 text-sm"
                  >
                    Remover
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {editPreviewUrls.map((url, index) => (
                    <div
                      key={url}
                      aria-label={`Preview ${index + 1}`}
                      className="h-24 rounded-lg border border-[var(--line)] bg-cover bg-center"
                      style={{ backgroundImage: `url(${url})` }}
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="submit"
                disabled={actionLoading === editingProduct.id}
                className="btn-primary"
              >
                <Edit3 className="h-5 w-5" />
                {actionLoading === editingProduct.id ? "Salvando..." : "Salvar alteracoes"}
              </button>

              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="btn-secondary"
              >
                Cancelar
              </button>
            </div>
          </div>
        </form>
      )}

      {loading && (
        <div className="grid gap-3">
          <AdminSkeleton />
          <AdminSkeleton />
          <AdminSkeleton />
        </div>
      )}

      {!loading && products.length === 0 && (
        <div className="card p-8 text-center">
          <p className="text-2xl font-black text-[var(--foreground)]">Nenhum produto cadastrado</p>
          <p className="mt-2 text-base text-[var(--muted)]">Use a aba Novo produto para cadastrar a primeira peça.</p>
        </div>
      )}

      {!loading && products.length > 0 && filteredProducts.length === 0 && (
        <div className="card p-8 text-center">
          <p className="text-2xl font-black text-[var(--foreground)]">Nenhum produto encontrado</p>
          <p className="mt-2 text-base text-[var(--muted)]">Ajuste a busca ou o filtro de status.</p>
        </div>
      )}

      {!loading && filteredProducts.length > 0 && (
        <div className="grid gap-3">
          {filteredProducts.map((product) => {
            const active = isProductActive(product.status)
            const disabled = actionLoading === product.id

            return (
              <article
                key={product.id}
                className="card grid gap-4 p-4 lg:grid-cols-[5rem_1fr_auto] lg:items-center"
              >
                <div className="relative h-24 overflow-hidden rounded-lg bg-[var(--surface-muted)] lg:h-20">
                  <SafeImage
                    src={product.imagens?.[0]?.url}
                    alt={`Foto de ${product.nome}`}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-xl font-black text-[var(--foreground)]">{product.nome}</h2>
                      <span className={`badge ${active ? "badge-success" : "badge-muted"}`}>
                        {active ? "Ativo" : "Inativo"}
                      </span>
                      {(product.mais_pedido || product.maisPedido) && (
                        <span className="badge badge-accent ml-2">Mais pedido</span>
                      )}
                  </div>
                  {product.categoria && (
                    <p className="mt-2 text-sm font-black uppercase tracking-[0.15em] text-[var(--primary)]">
                      {product.categoria}
                    </p>
                  )}
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--muted)]">
                    {product.descricao || "Sem descrição cadastrada."}
                  </p>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row lg:flex-col">
                  <a
                    href={careInstructionsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-accent px-4 py-3 text-sm"
                  >
                    <Send className="h-4 w-4" />
                    Enviar cuidados
                  </a>

                  <button
                    type="button"
                    onClick={() => startEdit(product)}
                    className="btn-secondary px-4 py-3 text-sm"
                    disabled={disabled}
                  >
                    <Edit3 className="h-4 w-4" />
                    Editar
                  </button>

                  <button
                    type="button"
                    onClick={() => handleToggle(product)}
                    className="btn-secondary px-4 py-3 text-sm"
                    disabled={disabled}
                  >
                    <Power className="h-4 w-4" />
                    {active ? "Desativar" : "Ativar"}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(product)}
                    className="btn-danger px-4 py-3 text-sm"
                    disabled={disabled}
                  >
                    <Trash2 className="h-4 w-4" />
                    Excluir
                  </button>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}
