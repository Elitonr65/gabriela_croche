"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { KeyRound, LogIn, ShieldCheck } from "lucide-react"
import { getErrorMessage } from "@/lib/errors"
import { signIn } from "@/services/auth"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const router = useRouter()

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      await signIn(email, password)
      router.replace("/admin")
    } catch (error) {
      setMessage(getErrorMessage(error, "Erro ao entrar. Confira email e senha."))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app-container grid min-h-[calc(100vh-8rem)] items-center gap-6 py-8 lg:grid-cols-[1fr_26rem]">
      <section>
        <p className="brand-kicker">
          <ShieldCheck className="h-4 w-4" />
          Admin
        </p>
        <h1 className="mt-2 max-w-2xl text-4xl font-black leading-tight text-[var(--foreground)]">
          Acesso ao painel de produtos.
        </h1>
        <p className="mt-4 max-w-xl text-lg leading-8 text-[var(--muted)]">
          Entre para cadastrar imagens, editar descrições e controlar quais produtos aparecem no catálogo público.
        </p>
      </section>

      <form onSubmit={handleLogin} className="card p-6">
        <h2 className="inline-flex items-center gap-2 text-2xl font-black text-[var(--foreground)]">
          <KeyRound className="h-6 w-6 text-[var(--primary)]" />
          Entrar
        </h2>

        {message && (
          <p role="alert" aria-live="assertive" className="message-error mt-5 text-sm">
            {message}
          </p>
        )}

        <label className="mt-6 block text-sm font-bold text-[var(--foreground)]">
          Email
        </label>
        <input
          className="field mt-2 px-4 py-4 text-base"
          placeholder="email@exemplo.com"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="email"
          required
        />

        <label className="mt-5 block text-sm font-bold text-[var(--foreground)]">
          Senha
        </label>
        <input
          className="field mt-2 px-4 py-4 text-base"
          type="password"
          placeholder="Sua senha"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="current-password"
          required
        />

        <button
          disabled={loading}
          className="btn-primary mt-6 w-full"
        >
          <LogIn className="h-5 w-5" />
          {loading ? "Entrando..." : "Entrar no painel"}
        </button>
      </form>
    </div>
  )
}
