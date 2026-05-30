"use client"

import { useEffect, useState } from "react"
import { ImagePlus, Palette, Save, Sparkles, X } from "lucide-react"
import { getErrorMessage } from "@/lib/errors"
import { ensureAuthenticatedSession } from "@/services/auth"
import { createProduct } from "@/services/createProduct"
import { uploadMultipleImages } from "@/services/uploadMultipleImages"

type AdminCreateProps = {
  onCreated?: () => void
}

export default function AdminCreate({ onCreated }: AdminCreateProps) {
  const [nome, setNome] = useState("")
  const [descricao, setDescricao] = useState("")
  const [cores, setCores] = useState("")
  const [categoria, setCategoria] = useState("")
  const [maisPedido, setMaisPedido] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [previewUrls, setPreviewUrls] = useState<string[]>([])
  const [fileInputKey, setFileInputKey] = useState(0)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  async function handleCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!nome.trim()) {
      setMessage({ type: "error", text: "Nome obrigatorio." })
      return
    }

    if (files.length === 0) {
      setMessage({ type: "error", text: "Selecione de 1 a 4 imagens." })
      return
    }

    if (files.length > 4) {
      setMessage({ type: "error", text: "Limite máximo de 4 imagens." })
      return
    }

    setLoading(true)
    setMessage(null)

    try {
      await ensureAuthenticatedSession()

      const urls = await uploadMultipleImages(files)

      await createProduct({
        nome,
        descricao,
        cores,
        categoria,
        maisPedido,
        images: urls,
      })

      setNome("")
      setDescricao("")
      setCores("")
      setCategoria("")
      setMaisPedido(false)
      setFiles([])
      setPreviewUrls([])
      setFileInputKey((current) => current + 1)
      setMessage({ type: "success", text: "Produto criado com sucesso." })
    } catch (error) {
      setMessage({ type: "error", text: getErrorMessage(error, "Erro ao criar produto.") })
    } finally {
      setLoading(false)
    }
  }

  function handleFilesChange(fileList: FileList | null) {
    previewUrls.forEach((url) => URL.revokeObjectURL(url))

    const selectedFiles = Array.from(fileList || [])
    setFiles(selectedFiles)
    setPreviewUrls(selectedFiles.map((file) => URL.createObjectURL(file)))
  }

  function clearFiles() {
    previewUrls.forEach((url) => URL.revokeObjectURL(url))
    setFiles([])
    setPreviewUrls([])
    setFileInputKey((current) => current + 1)
  }

  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [previewUrls])

  return (
    <form onSubmit={handleCreate} className="card max-w-3xl p-6">
      <p className="brand-kicker">
        <Sparkles className="h-4 w-4" />
        Cadastro
      </p>
      <h1 className="mt-1 text-4xl font-black text-[var(--foreground)]">
        Novo produto
      </h1>
      <p className="mt-2 text-base leading-7 text-[var(--muted)]">
        Cadastre nome, descrição e imagens. O produto novo entra ativo no catálogo.
      </p>

      <div className="mt-6 grid gap-5">
        {message && (
          <div
            role="status"
            aria-live="polite"
            className={`${message.type === "success" ? "message-success" : "message-error"} text-sm`}>
            <p>{message.text}</p>
            {message.type === "success" && onCreated && (
              <button
                type="button"
                onClick={onCreated}
                className="mt-3 rounded-lg bg-white px-4 py-2 text-sm font-black text-[var(--foreground)]"
              >
                Ver produtos
              </button>
            )}
          </div>
        )}

        <div>
          <label className="block text-sm font-bold text-[var(--foreground)]">Nome</label>
          <input
            value={nome}
            onChange={(event) => setNome(event.target.value)}
            placeholder="Ex: Bolsa croche esmeralda"
            className="field mt-2 px-4 py-4 text-base"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-[var(--foreground)]">Descrição</label>
          <textarea
            value={descricao}
            onChange={(event) => setDescricao(event.target.value)}
            placeholder="Descreva tamanho, material, cor e detalhes importantes"
            className="field mt-2 min-h-36 px-4 py-4 text-base"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-[var(--foreground)]">Categoria</label>
          <select
            value={categoria}
            onChange={(event) => setCategoria(event.target.value)}
            className="field mt-2 px-4 py-4 text-base"
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
          <p className="mt-2 text-sm text-[var(--muted)]">Escolha uma categoria fixa para organizar o catálogo.</p>
        </div>

        <label className="flex items-center gap-3 rounded-lg border border-[var(--line)] bg-[var(--surface-muted)] px-4 py-3 text-base font-bold text-[var(--foreground)]">
          <input
            type="checkbox"
            checked={maisPedido}
            onChange={(e) => setMaisPedido(e.target.checked)}
            className="h-5 w-5"
          />
          Marcar como &quot;Mais pedido&quot;
        </label>

        <div>
          <label className="inline-flex items-center gap-2 text-sm font-bold text-[var(--foreground)]">
            <Palette className="h-4 w-4 text-[var(--primary)]" />
            Cores disponíveis
          </label>
          <input
            value={cores}
            onChange={(event) => setCores(event.target.value)}
            placeholder="Ex: Rosa, Azul, Verde, Bege (separe por virgula)"
            className="field mt-2 px-4 py-4 text-base"
          />
          <p className="mt-2 text-sm text-[var(--muted)]">Separe as cores por vírgula. O cliente poderá escolher ao consultar.</p>
        </div>

        <div>
          <label className="inline-flex items-center gap-2 text-sm font-bold text-[var(--foreground)]">
            <ImagePlus className="h-4 w-4 text-[var(--accent)]" />
            Imagens
          </label>
          <input
            key={fileInputKey}
            type="file"
            multiple
            accept="image/png,image/jpeg,image/webp,image/gif"
            className="field mt-2 cursor-pointer border-dashed px-4 py-5 text-base font-semibold text-[var(--foreground)]"
            onChange={(event) => handleFilesChange(event.target.files)}
          />
          <p className="mt-2 text-sm text-[var(--muted)]">
            Selecione de 1 a 4 imagens (PNG, JPG, WEBP ou GIF, até 5MB por arquivo).
          </p>
        </div>

        {previewUrls.length > 0 && (
          <div>
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="text-sm font-bold text-[var(--foreground)]">{previewUrls.length} imagem(ns) selecionada(s)</p>
              <button type="button" onClick={clearFiles} className="btn-secondary px-4 py-2 text-sm">
                <X className="h-4 w-4" />
                Remover imagens
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {previewUrls.map((url, index) => (
                <div
                  key={url}
                  aria-label={`Preview da imagem ${index + 1}`}
                  className="overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--surface-muted)] shadow-sm"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={url}
                    alt={`Preview da imagem ${index + 1}`}
                    className="h-36 w-full object-cover"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full sm:w-fit"
        >
          <Save className="h-5 w-5" />
          {loading ? "Salvando..." : "Criar produto"}
        </button>
      </div>
    </form>
  )
}
