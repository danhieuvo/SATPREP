-- Fetch 1600 pack server. Paste this whole file into Supabase > SQL Editor > New query, then Run.
-- It is safe to run again after updates.
--
-- Privacy rules:
--   * Nobody can read the tables directly with the app's public key.
--   * A player can see only the players and activity in THEIR OWN pack, through functions that check
--     that player's private device secret.
--   * All writes also check the device secret, so nobody can change another player's progress.
--   * Admins (emails listed in sq_admins, signed in with Supabase Auth) can see every player via the
--     admin page. Add yourself once in the SQL Editor (not in this file, which is public):
--       insert into sq_admins(email) values ('you@example.com');

create table if not exists sq_squads (
  code text primary key check (code ~ '^[A-Z0-9]{6}$'),
  name text not null check (length(name) between 1 and 40),
  created_at timestamptz not null default now()
);

create table if not exists sq_players (
  id uuid primary key,
  squad text references sq_squads(code) on delete set null,
  data jsonb not null default '{}',
  updated_at timestamptz not null default now()
);
create index if not exists sq_players_squad on sq_players(squad);

-- Full progress backup (used by transfer codes and the admin page).
create table if not exists sq_private (
  id uuid primary key,
  secret text not null,
  data jsonb not null default '{}',
  updated_at timestamptz not null default now()
);

create table if not exists sq_events (
  id bigint generated always as identity primary key,
  squad text not null references sq_squads(code) on delete cascade,
  player uuid not null,
  target uuid,
  kind text not null check (length(kind) <= 20),
  body jsonb not null default '{}',
  kudos uuid[] not null default '{}',
  created_at timestamptz not null default now()
);
create index if not exists sq_events_squad on sq_events(squad, id desc);

create table if not exists sq_admins (
  email text primary key
);

-- Lock every table: row level security on, no read policies, no direct grants.
alter table sq_squads enable row level security;
alter table sq_players enable row level security;
alter table sq_private enable row level security;
alter table sq_events enable row level security;
alter table sq_admins enable row level security;
drop policy if exists "read squads" on sq_squads;
drop policy if exists "read players" on sq_players;
drop policy if exists "read events" on sq_events;
revoke all on sq_squads, sq_players, sq_private, sq_events, sq_admins from anon, authenticated;

-- ---------- Players ----------

-- Checks (or, for a brand-new player, registers) the device secret.
create or replace function sq_check(p_id uuid, p_secret text) returns void
language plpgsql security definer set search_path = public as $$
declare s text;
begin
  if p_secret is null or length(p_secret) < 16 then raise exception 'bad secret'; end if;
  select secret into s from sq_private where id = p_id;
  if s is null then
    insert into sq_private(id, secret) values (p_id, p_secret);
  elsif s <> p_secret then
    raise exception 'bad secret';
  end if;
end $$;

create or replace function sq_create_squad(p_code text, p_name text) returns void
language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from sq_squads where code = p_code) then raise exception 'code exists'; end if;
  insert into sq_squads(code, name) values (p_code, left(trim(p_name), 40));
end $$;

-- Looks up one pack by its exact code (needed to join). Does not list packs.
create or replace function sq_get_squad(p_code text) returns table(code text, name text)
language sql security definer set search_path = public stable as $$
  select q.code, q.name from sq_squads q where q.code = p_code;
$$;

create or replace function sq_save(p_id uuid, p_secret text, p_squad text, p_public jsonb, p_private jsonb) returns void
language plpgsql security definer set search_path = public as $$
begin
  perform sq_check(p_id, p_secret);
  if length(p_public::text) > 20000 or length(p_private::text) > 800000 then raise exception 'too large'; end if;
  update sq_private set data = p_private, updated_at = now() where id = p_id;
  insert into sq_players(id, squad, data, updated_at)
  values (p_id, (select q.code from sq_squads q where q.code = p_squad), p_public, now())
  on conflict (id) do update set squad = excluded.squad, data = excluded.data, updated_at = now();
end $$;

create or replace function sq_restore(p_id uuid, p_secret text) returns jsonb
language plpgsql security definer set search_path = public as $$
declare d jsonb;
begin
  select data into d from sq_private where id = p_id and secret = p_secret;
  if d is null then raise exception 'Transfer code not found'; end if;
  return d;
end $$;

-- Players in the caller's own pack (just the caller if they have no pack).
create or replace function sq_pack_players(p_id uuid, p_secret text)
returns table(id uuid, data jsonb, updated_at timestamptz)
language plpgsql security definer set search_path = public as $$
declare my_squad text;
begin
  perform sq_check(p_id, p_secret);
  select pl.squad into my_squad from sq_players pl where pl.id = p_id;
  if my_squad is null then
    return query select pl.id, pl.data, pl.updated_at from sq_players pl where pl.id = p_id;
  else
    return query select pl.id, pl.data, pl.updated_at from sq_players pl where pl.squad = my_squad limit 200;
  end if;
end $$;

-- Recent activity in the caller's own pack.
create or replace function sq_pack_events(p_id uuid, p_secret text)
returns table(id bigint, player uuid, target uuid, kind text, body jsonb, kudos uuid[], created_at timestamptz)
language plpgsql security definer set search_path = public as $$
declare my_squad text;
begin
  perform sq_check(p_id, p_secret);
  select pl.squad into my_squad from sq_players pl where pl.id = p_id;
  if my_squad is null then return; end if;
  return query select e.id, e.player, e.target, e.kind, e.body, e.kudos, e.created_at
    from sq_events e where e.squad = my_squad order by e.id desc limit 60;
end $$;

create or replace function sq_post(p_id uuid, p_secret text, p_squad text, p_kind text, p_target uuid, p_body jsonb) returns void
language plpgsql security definer set search_path = public as $$
begin
  perform sq_check(p_id, p_secret);
  if length(p_body::text) > 2000 then raise exception 'too large'; end if;
  if not exists (select 1 from sq_players pl where pl.id = p_id and pl.squad = p_squad) then raise exception 'not in squad'; end if;
  if p_target is not null and not exists (select 1 from sq_players pl where pl.id = p_target and pl.squad = p_squad) then raise exception 'not in squad'; end if;
  insert into sq_events(squad, player, target, kind, body) values (p_squad, p_id, p_target, p_kind, p_body);
  delete from sq_events where created_at < now() - interval '30 days';
end $$;

create or replace function sq_kudos(p_id uuid, p_secret text, p_event bigint) returns void
language plpgsql security definer set search_path = public as $$
begin
  perform sq_check(p_id, p_secret);
  update sq_events set kudos = array_append(kudos, p_id)
  where id = p_event and not (p_id = any(kudos))
    and squad = (select pl.squad from sq_players pl where pl.id = p_id);
end $$;

-- ---------- Admins ----------

-- True when the signed-in Supabase Auth user's email is in sq_admins.
create or replace function sq_is_admin() returns boolean
language sql security definer set search_path = public stable as $$
  select exists (select 1 from sq_admins a where lower(a.email) = lower(coalesce(auth.jwt() ->> 'email', '')));
$$;

-- Every player with their pack name and per-question-type ratings. Admins only.
create or replace function sq_admin_overview()
returns table(id uuid, squad text, squad_name text, data jsonb, elo jsonb, updated_at timestamptz)
language plpgsql security definer set search_path = public stable as $$
begin
  if not sq_is_admin() then raise exception 'not authorized'; end if;
  return query
    select p.id, p.squad, q.name, p.data, coalesce(pr.data -> 'elo', '{}'::jsonb), p.updated_at
    from sq_players p
    left join sq_squads q on q.code = p.squad
    left join sq_private pr on pr.id = p.id
    order by p.updated_at desc;
end $$;

-- ---------- Who may call what ----------
revoke all on function sq_check(uuid, text) from public, anon, authenticated;
revoke all on function sq_is_admin() from public, anon;
revoke all on function sq_admin_overview() from public, anon;
grant execute on function sq_is_admin() to authenticated;
grant execute on function sq_admin_overview() to authenticated;
grant execute on function sq_create_squad(text, text) to anon, authenticated;
grant execute on function sq_get_squad(text) to anon, authenticated;
grant execute on function sq_save(uuid, text, text, jsonb, jsonb) to anon, authenticated;
grant execute on function sq_restore(uuid, text) to anon, authenticated;
grant execute on function sq_pack_players(uuid, text) to anon, authenticated;
grant execute on function sq_pack_events(uuid, text) to anon, authenticated;
grant execute on function sq_post(uuid, text, text, text, uuid, jsonb) to anon, authenticated;
grant execute on function sq_kudos(uuid, text, bigint) to anon, authenticated;
