-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Enable Row Level Security
alter default privileges in schema public grant all on tables to postgres, anon, authenticated, service_role;

-- Users Table (extends Supabase Auth)
create table public.users (
  id uuid references auth.users not null primary key,
  email text,
  full_name text,
  avatar_url text,
  phone text,
  is_admin boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table public.users enable row level security;
create policy "Users can view own profile" on public.users for select using (auth.uid() = id);
create policy "Users can update own profile" on public.users for update using (auth.uid() = id);

-- Products Table
create table public.products (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  slug text unique not null,
  description text,
  price numeric not null,
  sale_price numeric,
  category text,
  images text[],
  stock_quantity integer default 0,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table public.products enable row level security;
create policy "Public can view active products" on public.products for select using (true);
create policy "Admins can insert products" on public.products for insert with check (exists (select 1 from public.users where id = auth.uid() and is_admin = true));
create policy "Admins can update products" on public.products for update using (exists (select 1 from public.users where id = auth.uid() and is_admin = true));

-- Orders Table
create table public.orders (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id),
  guest_email text, -- For guest checkout
  status text default 'processing', -- processing, shipped, delivered, cancelled
  total_amount numeric not null,
  shipping_address jsonb,
  payment_intent_id text,
  payment_status text default 'pending',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table public.orders enable row level security;
create policy "Users can view own orders" on public.orders for select using (auth.uid() = user_id);
create policy "Guests can view own orders by email" on public.orders for select using (guest_email = (current_setting('request.jwt.claim.email', true))); -- Simplified for now
create policy "Admins can view all orders" on public.orders for select using (exists (select 1 from public.users where id = auth.uid() and is_admin = true));

-- Order Items Table
create table public.order_items (
  id uuid default uuid_generate_v4() primary key,
  order_id uuid references public.orders(id) on delete cascade,
  product_id uuid references public.products(id),
  quantity integer not null,
  price_at_purchase numeric not null,
  variant_name text
);
alter table public.order_items enable row level security;
create policy "Users can view own order items" on public.order_items for select using (exists (select 1 from public.orders where id = order_items.order_id and user_id = auth.uid()));

-- Coupons Table
create table public.coupons (
  id uuid default uuid_generate_v4() primary key,
  code text unique not null,
  discount_type text not null, -- percentage, fixed
  discount_value numeric not null,
  min_purchase numeric,
  max_uses integer,
  used_count integer default 0,
  expires_at timestamp with time zone,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table public.coupons enable row level security;
create policy "Public can view valid coupons" on public.coupons for select using (is_active = true);

-- Reviews Table
create table public.reviews (
  id uuid default uuid_generate_v4() primary key,
  product_id uuid references public.products(id) on delete cascade,
  user_id uuid references public.users(id),
  rating integer check (rating >= 1 and rating <= 5),
  title text,
  content text,
  is_verified_purchase boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table public.reviews enable row level security;
create policy "Public can view reviews" on public.reviews for select using (true);

-- Abandoned Carts Table
create table public.abandoned_carts (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id),
  guest_email text,
  items jsonb,
  total_value numeric,
  email_sent boolean default false,
  last_active timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table public.abandoned_carts enable row level security;

-- Site Config (For Debug Panel / Live Edit)
create table public.site_config (
  key text primary key,
  value jsonb,
  updated_by uuid references public.users(id),
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table public.site_config enable row level security;
create policy "Public can view site config" on public.site_config for select using (true);
create policy "Admins can update site config" on public.site_config for update using (exists (select 1 from public.users where id = auth.uid() and is_admin = true));
create policy "Admins can insert site config" on public.site_config for insert with check (exists (select 1 from public.users where id = auth.uid() and is_admin = true));

-- Functions needed
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.users (id, email, full_name, avatar_url)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
