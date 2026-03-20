-- Customer inquiries table for homepage question/suggestion forms.
create table if not exists public.customer_inquiries (
  id uuid primary key default gen_random_uuid(),
  inquiry_type text not null check (inquiry_type in ('question', 'suggestion')),
  name text,
  email text not null,
  message text not null,
  topic text,
  location_hint text,
  user_id uuid references auth.users(id) on delete set null,
  page_path text default '/',
  status text not null default 'new' check (status in ('new', 'in_review', 'resolved')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists customer_inquiries_created_at_idx
  on public.customer_inquiries (created_at desc);

create index if not exists customer_inquiries_status_idx
  on public.customer_inquiries (status);

alter table public.customer_inquiries enable row level security;

-- Allow visitors and signed-in users to submit forms.
create policy "Anyone can insert customer inquiries"
  on public.customer_inquiries
  for insert
  with check (true);

-- Restrict read/update/delete to service role/admin workflows.

comment on table public.customer_inquiries is 'Inbound customer question and regulation suggestion submissions from the website.';
