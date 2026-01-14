-- Enable the storage extension if not already enabled (usually enabled by default)

-- 1. Create the bucket
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

-- 2. Enable RLS (Should be enabled by default for storage.objects)
alter table storage.objects enable row level security;

-- 3. Create Policy: Public Read Access
create policy "Public Access"
on storage.objects for select
using ( bucket_id = 'product-images' );

-- 4. Create Policy: Authenticated Users can Upload (Admin check ideally, but Auth for now)
create policy "Authenticated Users can Upload"
on storage.objects for insert
with check (
  bucket_id = 'product-images' 
  and auth.role() = 'authenticated'
);

-- 5. Create Policy: Authenticated Users can Update
create policy "Authenticated Users can Update"
on storage.objects for update
using (
  bucket_id = 'product-images' 
  and auth.role() = 'authenticated'
);

-- 6. Create Policy: Authenticated Users can Delete
create policy "Authenticated Users can Delete"
on storage.objects for delete
using (
  bucket_id = 'product-images' 
  and auth.role() = 'authenticated'
);
