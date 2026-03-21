-- General contact inquiries (accounts, billing, subscriptions) alongside regulation question/suggestion.

alter table public.customer_inquiries drop constraint if exists customer_inquiries_inquiry_type_check;

alter table public.customer_inquiries
  add constraint customer_inquiries_inquiry_type_check
  check (inquiry_type in ('question', 'suggestion', 'general'));

alter table public.customer_inquiries
  add column if not exists category text;

comment on column public.customer_inquiries.category is 'For inquiry_type=general: e.g. account, billing, subscription, other.';
