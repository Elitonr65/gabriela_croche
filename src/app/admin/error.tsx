"use client"

import Link from "next/link"

export default function AdminError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="app-container py-20">
      <div className="card mx-auto max-w-2xl p-8 text-center">
        <p className="text-sm font-bold text-gray-500">Erro</p>
        <h1 className="mt-2 text-4xl font-black leading-tight text-gray-950">
          Erro no painel admin
        </h1>
        <p className="mt-4 text-lg leading-8 text-gray-600">
          Nao foi possivel carregar o painel. Sua sessao pode ter expirado.
        </p>
        <div className="mt-7 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <button onClick={reset} className="btn-primary">
            Tentar novamente
          </button>
          <Link href="/login" className="btn-secondary">
            Fazer login
          </Link>
        </div>
      </div>
    </div>
  )
}
