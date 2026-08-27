-- Public covers; authenticated users may upload. App still limits authors to MENTOR/ADMIN.

insert into storage.buckets (id, name, public)
values ('blog-covers', 'blog-covers', true)
on conflict (id) do nothing;

drop policy if exists "Public read blog covers" on storage.objects;
create policy "Public read blog covers"
on storage.objects for select
using (bucket_id = 'blog-covers');

drop policy if exists "Authenticated upload blog covers" on storage.objects;
create policy "Authenticated upload blog covers"
on storage.objects for insert
to authenticated
with check (bucket_id = 'blog-covers');

drop policy if exists "Authenticated update blog covers" on storage.objects;
create policy "Authenticated update blog covers"
on storage.objects for update
to authenticated
using (bucket_id = 'blog-covers');

drop policy if exists "Authenticated delete blog covers" on storage.objects;
create policy "Authenticated delete blog covers"
on storage.objects for delete
to authenticated
using (bucket_id = 'blog-covers');
