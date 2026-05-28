-- Execute este arquivo no SQL Editor do Supabase.
-- Ele assume as tabelas public.produtos e public.imagens.
-- Tambem cria/atualiza o bucket publico "produtos" para upload de imagens.

-- Adicionar coluna cores (se nao existir)
alter table public.produtos add column if not exists cores text;

create table if not exists public.admins (
  user_id text primary key,
  created_at timestamp with time zone default now()
);

alter table public.admins enable row level security;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'produtos',
  'produtos',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

alter table public.produtos enable row level security;
alter table public.imagens enable row level security;

grant usage on schema public to anon, authenticated;
grant select on public.produtos, public.imagens to anon, authenticated;
grant insert, update, delete on public.produtos, public.imagens to authenticated;
grant usage, select on all sequences in schema public to authenticated;

drop policy if exists "Produtos ativos sao publicos" on public.produtos;
drop policy if exists "Admins autenticados gerenciam produtos" on public.produtos;
drop policy if exists "Produtos publicos ou admin" on public.produtos;
drop policy if exists "Admins inserem produtos" on public.produtos;
drop policy if exists "Admins atualizam produtos" on public.produtos;
drop policy if exists "Admins deletam produtos" on public.produtos;

drop policy if exists "Admins consultam tabela admins" on public.admins;

create policy "Admins consultam tabela admins"
on public.admins
for select
to authenticated
using (auth.uid() = user_id::uuid);

create policy "Produtos publicos ou admin"
on public.produtos
for select
to anon, authenticated
using (
  (
    auth.role() = 'authenticated'
    and exists (
      select 1
      from public.admins
      where user_id::uuid = auth.uid()
    )
  )
  or lower(status::text) in ('true', 't', '1', 'ativo', 'active', 'sim', 'yes')
);

create policy "Admins inserem produtos"
on public.produtos
for insert
to authenticated
with check (
  exists (
    select 1
    from public.admins
    where user_id::uuid = auth.uid()
  )
);

create policy "Admins atualizam produtos"
on public.produtos
for update
to authenticated
using (
  exists (
    select 1
    from public.admins
    where user_id::uuid = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.admins
    where user_id::uuid = auth.uid()
  )
);

create policy "Admins deletam produtos"
on public.produtos
for delete
to authenticated
using (
  exists (
    select 1
    from public.admins
    where user_id::uuid = auth.uid()
  )
);

drop policy if exists "Imagens de produtos ativos sao publicas" on public.imagens;
drop policy if exists "Admins autenticados gerenciam imagens" on public.imagens;
drop policy if exists "Imagens publicas ou admin" on public.imagens;
drop policy if exists "Admins inserem imagens" on public.imagens;
drop policy if exists "Admins atualizam imagens" on public.imagens;
drop policy if exists "Admins deletam imagens" on public.imagens;

create policy "Imagens publicas ou admin"
on public.imagens
for select
to anon, authenticated
using (
  (
    auth.role() = 'authenticated'
    and exists (
      select 1
      from public.admins
      where user_id::uuid = auth.uid()
    )
  )
  or exists (
    select 1
    from public.produtos
    where produtos.id = imagens.produto_id
      and lower(produtos.status::text) in ('true', 't', '1', 'ativo', 'active', 'sim', 'yes')
  )
);

create policy "Admins inserem imagens"
on public.imagens
for insert
to authenticated
with check (
  exists (
    select 1
    from public.admins
    where user_id::uuid = auth.uid()
  )
);

create policy "Admins atualizam imagens"
on public.imagens
for update
to authenticated
using (
  exists (
    select 1
    from public.admins
    where user_id::uuid = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.admins
    where user_id::uuid = auth.uid()
  )
);

create policy "Admins deletam imagens"
on public.imagens
for delete
to authenticated
using (
  exists (
    select 1
    from public.admins
    where user_id::uuid = auth.uid()
  )
);

drop policy if exists "Imagens publicas do bucket produtos" on storage.objects;
drop policy if exists "Admins autenticados enviam imagens" on storage.objects;
drop policy if exists "Admins autenticados removem imagens" on storage.objects;
drop policy if exists "Bucket produtos leitura publica" on storage.objects;
drop policy if exists "Admins enviam arquivos no bucket produtos" on storage.objects;
drop policy if exists "Admins atualizam arquivos no bucket produtos" on storage.objects;
drop policy if exists "Admins removem arquivos no bucket produtos" on storage.objects;

create policy "Bucket produtos leitura publica"
on storage.objects
for select
to public
using (bucket_id = 'produtos');

create policy "Admins enviam arquivos no bucket produtos"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'produtos'
  and exists (
    select 1
    from public.admins
    where user_id::uuid = auth.uid()
  )
);

create policy "Admins atualizam arquivos no bucket produtos"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'produtos'
  and exists (
    select 1
    from public.admins
    where user_id::uuid = auth.uid()
  )
)
with check (
  bucket_id = 'produtos'
  and exists (
    select 1
    from public.admins
    where user_id::uuid = auth.uid()
  )
);

create policy "Admins removem arquivos no bucket produtos"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'produtos'
  and exists (
    select 1
    from public.admins
    where user_id::uuid = auth.uid()
  )
);
