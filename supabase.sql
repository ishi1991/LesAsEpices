-- Les As Épices – Supabase setup
-- Supabase dashboard > SQL Editor > New query > paste this > Run.
-- The public website can only INSERT (send forms). Only you, logged in to
-- Supabase, can read the submissions (Table Editor).

create table if not exists public.join_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null check (char_length(name) between 1 and 120),
  email text not null check (char_length(email) between 3 and 200),
  phone text check (char_length(phone) <= 40),
  city text check (char_length(city) <= 100),
  role text check (role in ('member','volunteer','cook','supporter')),
  message text check (char_length(message) <= 2000),
  lang text check (lang in ('fr','en'))
);

create table if not exists public.donation_pledges (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null check (char_length(name) between 1 and 120),
  email text not null check (char_length(email) between 3 and 200),
  amount numeric not null check (amount > 0 and amount <= 100000),
  method text check (method in ('cash','wero','cheque')),
  message text check (char_length(message) <= 2000),
  lang text check (lang in ('fr','en'))
);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null check (char_length(name) between 1 and 120),
  email text not null check (char_length(email) between 3 and 200),
  subject text check (subject in ('order','event','info','other')),
  message text not null check (char_length(message) between 1 and 4000),
  lang text check (lang in ('fr','en'))
);

alter table public.join_requests    enable row level security;
alter table public.donation_pledges enable row level security;
alter table public.contact_messages enable row level security;

-- Anyone (the website) may insert; nobody may read/update/delete via the public key.
create policy "public can send join requests"  on public.join_requests    for insert to anon with check (true);
create policy "public can send pledges"        on public.donation_pledges for insert to anon with check (true);
create policy "public can send contact msgs"   on public.contact_messages for insert to anon with check (true);

-- If you already created donation_pledges before, add the payment-method column:
alter table public.donation_pledges add column if not exists method text check (method in ('cash','wero','cheque'));

-- Reviews: visitors can send a review (always unapproved) and read only approved ones.
-- To publish a review: Table Editor > reviews > set approved = true.
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null check (char_length(name) between 1 and 80),
  rating int not null check (rating between 1 and 5),
  comment text not null check (char_length(comment) between 1 and 1000),
  lang text check (lang in ('fr','en')),
  approved boolean not null default false
);
alter table public.reviews enable row level security;
create policy "public can send reviews" on public.reviews for insert to anon with check (approved = false);
create policy "public can read approved reviews" on public.reviews for select to anon using (approved = true);
