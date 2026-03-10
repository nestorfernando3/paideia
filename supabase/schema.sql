create extension if not exists pgcrypto;

create table if not exists public.sessions (
    code text primary key check (char_length(code) = 4 and code = upper(code)),
    topic text not null,
    active_tools text[] not null default '{}',
    created_at timestamptz not null default timezone('utc', now()),
    active boolean not null default true,
    ended_at timestamptz,
    updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.tool_entries (
    id uuid primary key default gen_random_uuid(),
    session_code text not null references public.sessions(code) on delete cascade,
    tool_name text not null,
    entry jsonb not null default '{}'::jsonb,
    created_at timestamptz not null default timezone('utc', now()),
    updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists tool_entries_session_tool_created_idx
on public.tool_entries (session_code, tool_name, created_at, id);

create or replace function public.touch_sessions_updated_at()
returns trigger
language plpgsql
as $$
begin
    new.updated_at = timezone('utc', now());
    return new;
end;
$$;

drop trigger if exists sessions_touch_updated_at on public.sessions;
create trigger sessions_touch_updated_at
before update on public.sessions
for each row
execute function public.touch_sessions_updated_at();

drop trigger if exists tool_entries_touch_updated_at on public.tool_entries;
create trigger tool_entries_touch_updated_at
before update on public.tool_entries
for each row
execute function public.touch_sessions_updated_at();

alter table public.sessions enable row level security;
alter table public.tool_entries enable row level security;

drop policy if exists "authenticated_read_sessions" on public.sessions;
create policy "authenticated_read_sessions"
on public.sessions
for select
to authenticated
using (true);

drop policy if exists "authenticated_insert_sessions" on public.sessions;
create policy "authenticated_insert_sessions"
on public.sessions
for insert
to authenticated
with check (true);

drop policy if exists "authenticated_update_sessions" on public.sessions;
create policy "authenticated_update_sessions"
on public.sessions
for update
to authenticated
using (true)
with check (true);

drop policy if exists "authenticated_read_tool_entries" on public.tool_entries;
create policy "authenticated_read_tool_entries"
on public.tool_entries
for select
to authenticated
using (true);

drop policy if exists "authenticated_insert_tool_entries" on public.tool_entries;
create policy "authenticated_insert_tool_entries"
on public.tool_entries
for insert
to authenticated
with check (true);

drop policy if exists "authenticated_update_tool_entries" on public.tool_entries;
create policy "authenticated_update_tool_entries"
on public.tool_entries
for update
to authenticated
using (true)
with check (true);

do $$
begin
    if not exists (
        select 1
        from pg_publication_tables
        where pubname = 'supabase_realtime'
          and schemaname = 'public'
          and tablename = 'sessions'
    ) then
        execute 'alter publication supabase_realtime add table public.sessions';
    end if;

    if not exists (
        select 1
        from pg_publication_tables
        where pubname = 'supabase_realtime'
          and schemaname = 'public'
          and tablename = 'tool_entries'
    ) then
        execute 'alter publication supabase_realtime add table public.tool_entries';
    end if;
end
$$;
