-- STORAGE: allow upload
drop policy if exists "Auth upload portfolio public bucket" on storage.objects;
create policy "Auth upload portfolio public bucket"
on storage.objects for insert
to authenticated
with check (bucket_id = 'portfolio-public');

-- STORAGE: allow delete
drop policy if exists "Auth delete portfolio public bucket" on storage.objects;
create policy "Auth delete portfolio public bucket"
on storage.objects for delete
to authenticated
using (bucket_id = 'portfolio-public');

-- MEDIA TABLE: allow write
drop policy if exists "Auth write media" on public.media;
create policy "Auth write media"
on public.media for all
to authenticated
using (true)
with check (true);
