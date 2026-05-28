# Checklist de deploy na Vercel

Projeto: Gabriela Braga Croche

## Status local validado

- [x] `npm run lint` passou sem erros. Existe 1 aviso em `src/app/admin/AdminCreate.tsx` sobre preview local com `<img>`, sem bloquear deploy.
- [x] `npm run typecheck` passou.
- [x] `npm run build` passou com Next.js 16.2.6.
- [x] Responsividade validada em `/`, `/catalogo`, `/login`, `/admin` e `/produto/[id]`.
- [x] Viewports testadas: 320, 360, 390, 414, 768, 1024, 1366 e 1440 px.
- [x] O overflow horizontal em 320 px foi corrigido no cabecalho.
- [x] Depois da correcao: 40 checks automatizados, 0 falhas.

## Etapa 1 - Antes de subir para o Git

- [ ] Confirmar que `.env`, `.env.local` e qualquer segredo local nao entram no commit.
- [ ] Confirmar que `.env.example` continua sem valores reais.
- [ ] Confirmar que o Supabase tem:
  - tabela `produtos`;
  - tabela `imagens`;
  - bucket publico `produtos`;
  - policies/RLS aplicadas pelo arquivo `scripts/supabase-policies.sql`;
  - usuario administrador cadastrado na tabela `public.admins`, se a policy exigir.
- [ ] Rodar novamente:

```bash
npm run lint
npm run typecheck
npm run build
```

- [ ] Testar localmente:

```bash
npm run start
```

Rotas para conferir:

- `/catalogo`
- `/produto/[id]`
- `/login`
- `/admin`

## Etapa 2 - Subir para o Git

Status: concluido em `main`.

Repositorio:

- https://github.com/Elitonr65/gabriela_croche.git

Commit inicial:

- `a48e67e` - `Prepare catalog for Vercel deployment`

```bash
git status
git add .
git commit -m "Prepare catalog for Vercel deployment"
git branch -M main
git remote add origin URL_DO_REPOSITORIO
git push -u origin main
```

Se o remote ja existir:

```bash
git remote -v
git push -u origin main
```

## Etapa 3 - Criar projeto na Vercel

- [ ] Entrar na Vercel.
- [ ] Importar o repositorio do GitHub/GitLab/Bitbucket.
- [ ] Framework Preset: `Next.js`.
- [ ] Root Directory: raiz do projeto.
- [ ] Install Command: deixar automatico ou `npm install`.
- [ ] Build Command: deixar automatico ou `npm run build`.
- [ ] Output Directory: deixar padrao da Vercel para Next.js.

Variaveis de ambiente obrigatorias:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Variavel opcional:

```env
NEXT_PUBLIC_WHATSAPP_NUMBER=5569992845908
```

Adicionar as variaveis em `Production` e `Preview` se quiser que branches de teste tambem funcionem.

## Etapa 4 - Validar o deploy

- [ ] Abrir a URL gerada pela Vercel.
- [ ] Conferir `/catalogo` no celular.
- [ ] Abrir um produto em `/produto/[id]`.
- [ ] Testar botao de WhatsApp.
- [ ] Testar login em `/login`.
- [ ] Acessar `/admin`.
- [ ] Criar um produto de teste, ativar/desativar e conferir se aparece no catalogo.
- [ ] Validar imagens vindas do Supabase Storage.

## Etapa 5 - Entrega para cliente

Entregar ao cliente:

- URL publica do catalogo: `https://DOMINIO/catalogo`.
- URL do painel: `https://DOMINIO/login`.
- Usuario/senha do admin enviados por canal privado, nunca no Git.
- Instrucao curta: cadastrar produto, adicionar imagens, marcar ativo/inativo e conferir no catalogo.

Para Instagram:

- Usar a URL direta `/catalogo` na bio.
- Se houver dominio proprio, preferir `https://dominio.com/catalogo`.
- Se nao houver dominio proprio, usar a URL de producao da Vercel: `https://nome-do-projeto.vercel.app/catalogo`.

## Como funciona depois do Git + Vercel

- Push em branch diferente de `main`: Vercel cria um Preview Deployment para testar.
- Merge/push na branch `main`: Vercel cria o Production Deployment.
- Mudancas no admin nao precisam de novo deploy: elas salvam no Supabase e o catalogo publico atualiza pela revalidacao da rota.
- Mudancas no codigo precisam de commit + push para a Vercel publicar novamente.
- Mudancas em variaveis de ambiente da Vercel exigem novo deploy para refletir no app.

## Links oficiais uteis

- Next.js na Vercel: https://vercel.com/docs/frameworks/full-stack/nextjs
- Deploy por Git na Vercel: https://vercel.com/docs/git
- Variaveis de ambiente na Vercel: https://vercel.com/docs/environment-variables
- Configuracao de build na Vercel: https://vercel.com/docs/builds/configure-a-build
