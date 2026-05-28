"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { LogOut, Package, Plus, ShieldCheck } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { signOut } from "@/services/auth"

import AdminProducts from "./AdminProducts"
import AdminCreate from "./AdminCreate"

export default function AdminPage() {
  const router = useRouter()

  const [tab, setTab] = useState<"list" | "create">("list")
  const [checkingAuth, setCheckingAuth] = useState(true)

  useEffect(() => {
    async function checkAuth() {
      const { data } = await supabase.auth.getSession()

      if (!data.session) {
        router.replace("/login")
        return
      }

      setCheckingAuth(false)
    }

    checkAuth()
  }, [router])

  if (checkingAuth) {
    return (
      <div className="app-container py-20 text-center text-lg font-bold text-[var(--muted)]">
        Verificando acesso...
      </div>
    )
  }

  const navButtonClass = (target: "list" | "create") =>
    `inline-flex items-center gap-3 rounded-lg px-4 py-3 text-left text-base font-black ${
      tab === target
        ? "bg-[var(--primary)] text-white"
        : "border border-[var(--line)] bg-white text-[var(--foreground)] hover:bg-[var(--surface-muted)]"
    }`

  return (
    <div className="app-container grid gap-6 py-8 lg:grid-cols-[18rem_1fr]">
      <aside className="card h-fit p-5">
        <p className="brand-kicker">
          <ShieldCheck className="h-4 w-4" />
          Painel
        </p>
        <h1 className="mt-2 text-3xl font-black text-[var(--foreground)]">Admin</h1>

        <div className="mt-6 grid gap-3">
          <button
            type="button"
            onClick={() => setTab("list")}
            aria-pressed={tab === "list"}
            className={navButtonClass("list")}
          >
            <Package className="h-5 w-5" />
            Produtos
          </button>

          <button
            type="button"
            onClick={() => setTab("create")}
            aria-pressed={tab === "create"}
            className={navButtonClass("create")}
          >
            <Plus className="h-5 w-5" />
            Novo produto
          </button>
        </div>

        <button
          type="button"
          onClick={async () => {
            await signOut()
            router.replace("/login")
          }}
          className="btn-secondary mt-8 w-full justify-start"
        >
          <LogOut className="h-5 w-5" />
          Sair
        </button>
      </aside>

      <section>
        {tab === "list" && <AdminProducts />}
        {tab === "create" && <AdminCreate onCreated={() => setTab("list")} />}
      </section>
    </div>
  )
}
