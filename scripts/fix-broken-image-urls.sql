-- Execute no SQL Editor do Supabase para corrigir imagens antigas quebradas do seed.

update public.imagens
set url = '/placeholder.svg'
where url = 'https://images.unsplash.com/photo-1520975958225';
