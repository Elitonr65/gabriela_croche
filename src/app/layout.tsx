import Link from "next/link"
import Image from "next/image"
import { Heart, ShoppingBag } from "lucide-react"
import "./globals.css"

export const metadata = {
  title: "Gabriela Braga Crochê",
  description: "Catálogo online de produtos de crochê",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" data-scroll-behavior="smooth">
      <body className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-white/90 backdrop-blur">
          <div className="app-container flex h-16 items-center justify-between gap-3">
            <Link href="/" className="flex min-w-0 items-center gap-3">
              <Image
                src="/brand-gabriela-braga.jpeg"
                alt="Gabriela Braga Crochê"
                width={44}
                height={44}
                className="h-11 w-11 rounded-lg border border-[var(--line)] object-cover"
                priority
              />
              <span className="min-w-0">
                <span className="block truncate text-sm font-black leading-tight text-[var(--primary)] sm:text-base">
                  Gabriela Braga Crochê
                </span>
                <span className="hidden text-xs font-semibold text-[var(--muted)] sm:block">
                  Catálogo artesanal
                </span>
              </span>
            </Link>

            <nav className="flex items-center gap-2 text-sm font-bold">
              <Link href="/catalogo" aria-label="Abrir catálogo" title="Catálogo" className="inline-flex items-center gap-2 rounded-lg px-2.5 py-2 text-[var(--foreground)] hover:bg-[var(--surface-muted)] sm:px-3">
                <ShoppingBag className="h-4 w-4 text-[var(--primary)]" />
                <span className="hidden sm:inline">Catálogo</span>
              </Link>
            </nav>
          </div>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="border-t border-[var(--line)] bg-white">
          <div className="app-container flex flex-col items-center justify-center gap-2 py-5 text-center text-sm text-[var(--muted)] sm:flex-row">
            <Link href="/login" className="inline-flex items-center gap-2 font-semibold hover:opacity-80">
              <Image
                src="/brand-gabriela-braga.jpeg"
                alt="Gabriela Braga Crochê"
                width={28}
                height={28}
                className="h-7 w-7 rounded-lg border border-[var(--line)] object-cover"
              />
              <span className="inline-flex items-center gap-2">
                Feito para valorizar peças artesanais <Heart className="h-4 w-4 fill-[var(--primary)] text-[var(--primary)]" />
              </span>
            </Link>
            <span className="hidden text-[var(--line)] sm:inline">|</span>
            <span>By Notile Sustain Solution Technology</span>
            <span className="hidden text-[var(--line)] sm:inline">|</span>
          </div>
        </footer>
      </body>
    </html>
  )
}
