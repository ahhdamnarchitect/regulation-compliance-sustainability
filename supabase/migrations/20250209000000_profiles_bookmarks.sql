-- Add bookmarks column to profiles (regulation IDs saved per user, syncs across devices)
alter table public.profiles
  add column if not exists bookmarks text[] default '{}';

comment on column public.profiles.bookmarks is 'Regulation IDs bookmarked by the user (synced to profile for cross-device).';
