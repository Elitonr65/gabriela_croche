import "dotenv/config"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function seed() {
  console.log("🌱 Seed iniciando...")

  const cat = await supabase
    .from("categorias")
    .insert([{ nome: "Crochê Decorativo" }])
    .select()

  console.log("Categoria result:", cat)

  const prod = await supabase
    .from("produtos")
    .insert([
      {
        nome: "Tapete Artesanal",
        descricao: "Feito à mão",
        status: true,
      },
      {
        nome: "Sousplat Elegante",
        descricao: "Mesa posta",
        status: true,
      },
    ])
    .select()

  console.log("Produtos result:", prod)

  if (prod.data) {
    for (const p of prod.data) {
      const img = await supabase.from("imagens").insert([
        {
          produto_id: p.id,
          url: "/placeholder.svg",
          ordem: 0,
        },
      ])

      console.log("Imagem insert:", img)
    }
  }

  console.log("FINAL STATUS OK")
}

seed()
