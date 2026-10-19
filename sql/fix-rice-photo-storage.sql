-- Safely adds a configurable photo bucket to the existing shop settings.
-- This does not drop or reset products, orders, or settings.

alter table public.settings
  add column if not exists photo_bucket text not null default 'rice-photos';

update public.settings
set photo_bucket = 'rice-photos'
where id = 1 and nullif(trim(photo_bucket), '') is null;

insert into public.settings (id, photo_bucket)
values (1, 'rice-photos')
on conflict (id) do nothing;

insert into storage.buckets (
  id, name, public, file_size_limit, allowed_mime_types
)
select photo_bucket, photo_bucket, true, 5242880,
       array['image/jpeg', 'image/png', 'image/webp']::text[]
from public.settings
where id = 1
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "rice_photos_anon_insert" on storage.objects;
drop policy if exists "configured_photo_bucket_anon_insert" on storage.objects;
create policy "configured_photo_bucket_anon_insert"
on storage.objects for insert to anon
with check (
  bucket_id = (select photo_bucket from public.settings where id = 1)
);
