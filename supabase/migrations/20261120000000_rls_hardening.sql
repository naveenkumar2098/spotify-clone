-- =============================================================================
-- RLS HARDENING MIGRATION
--
-- !!! NOT YET APPLIED !!!
-- This file has NOT been run against any database. Review every statement
-- (especially against policies that already exist in your project), then apply
-- it with `supabase db push` or by pasting it into the Supabase SQL editor.
--
-- Written to be idempotent: RLS enable is repeatable, and each policy is
-- preceded by `drop policy if exists`. Note: policies with OTHER names that
-- already exist on these tables are NOT dropped and will still be OR-ed in;
-- list them with `select * from pg_policies where schemaname in ('public','storage');`
-- and remove any overly permissive ones.
-- Based on the tables/columns in types_db.ts.
-- =============================================================================

-- ---------------------------------------------------------------- songs
alter table public.songs enable row level security;

drop policy if exists "songs_select_public" on public.songs;
create policy "songs_select_public" on public.songs
  for select using (true);

drop policy if exists "songs_insert_owner" on public.songs;
create policy "songs_insert_owner" on public.songs
  for insert to authenticated with check (auth.uid() = user_id);

drop policy if exists "songs_update_owner" on public.songs;
create policy "songs_update_owner" on public.songs
  for update to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "songs_delete_owner" on public.songs;
create policy "songs_delete_owner" on public.songs
  for delete to authenticated using (auth.uid() = user_id);

-- ------------------------------------------------------------ playlists
alter table public.playlists enable row level security;

drop policy if exists "playlists_select_owner" on public.playlists;
create policy "playlists_select_owner" on public.playlists
  for select to authenticated using (auth.uid() = user_id);

drop policy if exists "playlists_insert_owner" on public.playlists;
create policy "playlists_insert_owner" on public.playlists
  for insert to authenticated with check (auth.uid() = user_id);

drop policy if exists "playlists_update_owner" on public.playlists;
create policy "playlists_update_owner" on public.playlists
  for update to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "playlists_delete_owner" on public.playlists;
create policy "playlists_delete_owner" on public.playlists
  for delete to authenticated using (auth.uid() = user_id);

-- ------------------------------------------------------- playlist_songs
alter table public.playlist_songs enable row level security;

drop policy if exists "playlist_songs_owner_all" on public.playlist_songs;
create policy "playlist_songs_owner_all" on public.playlist_songs
  for all to authenticated
  using (exists (
    select 1 from public.playlists p
    where p.id = playlist_id and p.user_id = auth.uid()
  ))
  with check (exists (
    select 1 from public.playlists p
    where p.id = playlist_id and p.user_id = auth.uid()
  ));

-- ---------------------------------------------------------- liked_songs
alter table public.liked_songs enable row level security;

drop policy if exists "liked_songs_owner_all" on public.liked_songs;
create policy "liked_songs_owner_all" on public.liked_songs
  for all to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ---------------------------------------------------------------- users
-- NOTE: users contains billing_address and payment_method. Subscription /
-- billing-related columns must NEVER be client-writable; only the server
-- (service role, e.g. a future Stripe webhook) may change them. RLS is
-- row-level only, so we also restrict writable columns below.
alter table public.users enable row level security;

drop policy if exists "users_select_own" on public.users;
create policy "users_select_own" on public.users
  for select to authenticated using (auth.uid() = id);

drop policy if exists "users_update_own" on public.users;
create policy "users_update_own" on public.users
  for update to authenticated
  using (auth.uid() = id) with check (auth.uid() = id);

revoke update on public.users from authenticated, anon;
grant update (full_name, avatar_url) on public.users to authenticated;

-- ------------------------------------------------------------ customers
-- RLS enabled with NO policies => no client (anon/authenticated) access.
-- The service role bypasses RLS.
alter table public.customers enable row level security;

-- -------------------------------------------------------- subscriptions
alter table public.subscriptions enable row level security;

drop policy if exists "subscriptions_select_own" on public.subscriptions;
create policy "subscriptions_select_own" on public.subscriptions
  for select to authenticated using (auth.uid() = user_id);

-- --------------------------------------------------- prices / products
alter table public.prices enable row level security;
drop policy if exists "prices_select_public" on public.prices;
create policy "prices_select_public" on public.prices
  for select using (true);

alter table public.products enable row level security;
drop policy if exists "products_select_public" on public.products;
create policy "products_select_public" on public.products
  for select using (true);

-- -------------------------------------------------------------- storage
-- Public read of the two buckets; writes only for signed-in users.
-- (update/delete on storage.objects get no policy => denied for clients.)
drop policy if exists "songs_bucket_public_read" on storage.objects;
create policy "songs_bucket_public_read" on storage.objects
  for select using (bucket_id = 'songs');

drop policy if exists "images_bucket_public_read" on storage.objects;
create policy "images_bucket_public_read" on storage.objects
  for select using (bucket_id = 'images');

drop policy if exists "songs_bucket_authenticated_insert" on storage.objects;
create policy "songs_bucket_authenticated_insert" on storage.objects
  for insert to authenticated with check (bucket_id = 'songs');

drop policy if exists "images_bucket_authenticated_insert" on storage.objects;
create policy "images_bucket_authenticated_insert" on storage.objects
  for insert to authenticated with check (bucket_id = 'images');

-- Server-side bucket limits (enforced by Storage regardless of client checks).
-- These assume the buckets already exist; they only update them.
update storage.buckets
   set allowed_mime_types = array['audio/mpeg'],
       file_size_limit    = 20 * 1024 * 1024   -- 20MB
 where id = 'songs';

update storage.buckets
   set allowed_mime_types = array['image/png', 'image/jpeg', 'image/webp'],
       file_size_limit    = 5 * 1024 * 1024    -- 5MB
 where id = 'images';
