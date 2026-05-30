import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import SafeImage from "@/components/SafeImage"
import ProductSidebar from "@/components/ProductSidebar"
import { getProductById } from "@/services/getProductById"

export async function generateMetadata({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  const { id } = (await params) as { id: string }
  const product = await getProductById(id)

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || ""

  if (!product) {
    return {
      title: "Produto",
    }
  }

  const imageUrl = product.imagens && product.imagens[0]?.url
    ? (product.imagens[0].url.startsWith("http") ? product.imagens[0].url : `${siteUrl.replace(/\/$/, "")}${product.imagens[0].url.startsWith("/") ? product.imagens[0].url : `/${product.imagens[0].url}`}`)
    : (siteUrl ? `${siteUrl.replace(/\/$/, "")}/placeholder.svg` : "/placeholder.svg")

  return {
    title: product.nome,
    description: product.descricao || "Produto disponível no catálogo",
    openGraph: {
      title: product.nome,
      description: product.descricao || "",
      url: siteUrl ? `${siteUrl.replace(/\/$/, "")}/produto/${id}` : `/produto/${id}`,
      images: [
        {
          url: imageUrl,
        },
      ],
    },
  }
}

export default async function ProdutoPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const product = await getProductById(id)

  if (!product) {
    notFound()
  }

  const images = [...(product.imagens || [])].sort((a, b) => (a.ordem || 0) - (b.ordem || 0))
  const galleryImages = images.length > 0 ? images : [{ url: "/placeholder.svg", ordem: 0 }]
  const mainImageUrl = images.length > 0 ? images[0].url : null

  return (
    <div className="app-container py-8">
      <Link href="/catalogo" className="mb-5 inline-flex items-center gap-2 text-sm font-black text-[var(--primary)] hover:text-[var(--primary-hover)]">
        <ArrowLeft className="h-4 w-4" />
        Voltar ao catálogo
      </Link>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_24rem]">
        <section className="grid gap-4 sm:grid-cols-2">
          {galleryImages.map((img, index) => (
            <div
              key={`${img.url}-${index}`}
              className={`relative overflow-hidden rounded-lg border border-[var(--line)] bg-[var(--surface-muted)] ${
                index === 0 ? "h-[28rem] sm:col-span-2" : "h-64"
              }`}
            >
              <SafeImage
                src={img.url}
                alt={`Foto de ${product.nome} ${index + 1}`}
                fill
                sizes={index === 0 ? "(max-width: 1024px) 100vw, 65vw" : "(max-width: 1024px) 50vw, 30vw"}
                className="object-cover"
                priority={index === 0}
              />
            </div>
          ))}
        </section>

        <ProductSidebar
          nome={product.nome}
          descricao={product.descricao}
          categoria={product.categoria}
          cores={product.cores}
          imagemUrl={mainImageUrl}
          productId={product.id}
        />
      </div>
    </div>
  )
}
