# Gabriela Braga Croche

Catalogo simples de pecas artesanais em croche, com vitrine publica, pagina de produto, contato por WhatsApp e painel administrativo integrado ao Supabase.

## Stack

- Next.js 16 com App Router
- React 19
- TypeScript
- Tailwind CSS 3
- Supabase Auth, Database e Storage
- Framer Motion

## Como Rodar

Instale as dependencias:

```bash
npm install
```

Crie um `.env.local` com base no `.env.example`:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Rode o servidor local:

```bash
npm run dev
```

Acesse `http://localhost:3000`.

## Scripts

```bash
npm run dev
npm run lint
npm run build
npm run start
npm run seed
```

## Rotas

- `/` pagina inicial
- `/catalogo` catalogo publico dinamico
- `/produto/[id]` detalhe do produto
- `/login` login administrativo
- `/admin` painel administrativo

## Supabase

O projeto espera estas tabelas:

- `produtos`: `id`, `nome`, `descricao`, `status`, `created_at`
- `imagens`: `id`, `produto_id`, `url`, `ordem`

Tambem espera um bucket publico chamado `produtos` no Supabase Storage.

O SQL de policies agora inclui uma tabela `public.admins` para permitir que apenas administradores autorizados façam CRUD no painel administrativo.

As policies sugeridas estao em:

```bash
scripts/supabase-policies.sql
```

Execute esse SQL no editor do Supabase para ativar RLS, proteger o painel admin e limitar escrita a usuarios autenticados e autorizados.

## Observacoes

- O catalogo e dinamico para refletir alteracoes do Supabase.
- Produtos inativos nao aparecem no catalogo nem abrem por URL direta.
- Imagens sem foto usam `public/placeholder.svg`.
- A seguranca real do admin depende das policies/RLS do Supabase.
