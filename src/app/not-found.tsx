import Link from "next/link"

export default function NotFound() {
  return (
    <div className="app-container py-20">
      <div className="card mx-auto max-w-2xl p-8 text-center">
        <p className="text-sm font-bold text-gray-500">404</p>

        <h1 className="mt-2 text-4xl font-black leading-tight text-gray-950">
          Produto nao encontrado
        </h1>

        <p className="mt-4 text-lg leading-8 text-gray-600">
          Esse item pode ter sido removido ou estar indisponivel no momento.
        </p>

        <Link href="/catalogo" className="btn-primary mt-7">
          Voltar ao catalogo
        </Link>
      </div>
    </div>
  )
}
