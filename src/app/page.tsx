import Link from "next/link"
import {
  ArrowRight,
  Heart,
  MessageCircle,
  Palette,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
} from "lucide-react"
import SafeImage from "@/components/SafeImage"
import { getProducts } from "@/services/products"

const highlights = [
  {
    icon: Sparkles,
    title: "Feito à mão",
    description: "Peças com acabamento artesanal e atenção aos detalhes.",
  },
  {
    icon: Palette,
    title: "Cores sob consulta",
    description: "Paleta inspirada nos fios da marca: rosa, azul, amarelo e roxo.",
  },
  {
    icon: MessageCircle,
    title: "Atendimento direto",
    description: "Cliente escolhe a peça e finaliza a conversa pelo WhatsApp.",
  },
]

export default async function Home() {
  const products = await getProducts()
  const latestProducts = products.slice(0, 6)

  return (
    <div>
      <section
        className="relative min-h-[72vh] overflow-hidden border-b border-[var(--line)] bg-[#f4ddc6]"
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgba(255, 247, 239, 0.98) 0%, rgba(255, 247, 239, 0.92) 34%, rgba(255, 247, 239, 0.46) 68%, rgba(255, 247, 239, 0.18) 100%), url('/brand-gabriela-braga.jpeg')",
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      >
        <div className="app-container flex min-h-[72vh] items-end py-12 sm:py-16">
          <div className="max-w-3xl pb-4">
            <p className="brand-kicker">
              <Sparkles className="h-4 w-4" />
              Peças artesanais em crochê
            </p>
            <h1 className="mt-4 text-5xl font-black leading-tight text-[var(--foreground)] sm:text-6xl">
              Gabriela Braga Crochê
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--muted)]">
              Catálogo online com produtos ativos, detalhes de cores e contato direto pelo WhatsApp para combinar disponibilidade.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link href="/catalogo" className="btn-primary">
                <ShoppingBag className="h-5 w-5" />
                Ver catálogo
              </Link>
              <Link href="/login" className="btn-secondary">
                Abrir admin
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="yarn-divider" />

      <div className="app-container py-8">
        <section className="grid gap-4 md:grid-cols-3">
          {highlights.map((item) => {
            const Icon = item.icon

            return (
              <article key={item.title} className="card p-5">
                <span className="grid h-11 w-11 place-items-center rounded-lg bg-[var(--surface-muted)] text-[var(--primary)]">
                  <Icon className="h-5 w-5" />
                </span>
                <h2 className="mt-4 text-xl font-black text-[var(--foreground)]">{item.title}</h2>
                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{item.description}</p>
              </article>
            )
          })}
        </section>

        <section className="mt-8 grid gap-5 lg:grid-cols-[1fr_20rem]">
          <div>
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="brand-kicker">
                  <Heart className="h-4 w-4" />
                  Vitrine
                </p>
                <h2 className="mt-2 text-3xl font-black text-[var(--foreground)]">Produtos recentes</h2>
              </div>
              <Link href="/catalogo" className="btn-secondary">
                Ver todos
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>

            {latestProducts.length === 0 ? (
              <div className="card p-8 text-center">
                <p className="text-xl font-black text-[var(--foreground)]">Nenhum produto público encontrado</p>
                <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-[var(--muted)]">
                  O admin pode estar funcionando, mas o Supabase precisa permitir leitura pública dos produtos ativos.
                </p>
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {latestProducts.map((product, index) => (
                  <Link
                    key={product.id}
                    href={`/produto/${product.id}`}
                    className="card group overflow-hidden hover:border-[#e6b5d4]"
                  >
                    <div className="relative h-60 bg-[var(--surface-muted)]">
                      <SafeImage
                        src={product.imagens?.[0]?.url}
                        alt={`Foto de ${product.nome}`}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                        priority={index === 0}
                      />
                    </div>
                    <div className="p-5">
                      <h3 className="text-xl font-black text-[var(--foreground)]">{product.nome}</h3>
                      <p className="mt-2 line-clamp-2 min-h-[3rem] text-sm leading-6 text-[var(--muted)]">
                        {product.descricao || "Produto cadastrado no catálogo."}
                      </p>
                      <p className="mt-4 inline-flex items-center gap-2 text-sm font-black text-[var(--primary)]">
                        Abrir detalhes
                        <ArrowRight className="h-4 w-4" />
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <aside className="card h-fit p-6">
            <p className="brand-kicker">
              <ShieldCheck className="h-4 w-4" />
              Catálogo
            </p>
            <p className="mt-4 text-5xl font-black leading-none text-[var(--primary)]">{products.length}</p>
            <p className="mt-2 text-base font-semibold text-[var(--muted)]">produto(s) ativo(s) visíveis para clientes</p>

            {products.length === 0 && (
              <p className="message-warning mt-5 text-sm">
                O catálogo público não recebeu produtos. Se o admin mostra itens ativos, aplique as policies do Supabase.
              </p>
            )}
          </aside>
        </section>
      </div>
    </div>
  )
}
