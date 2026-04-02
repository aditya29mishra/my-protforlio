create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.media (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  label text not null,
  media_kind text not null check (media_kind in ('image', 'gif', 'audio', 'pdf')),
  source_type text not null check (source_type in ('storage', 'external')),
  local_source_path text,
  storage_bucket text,
  storage_path text,
  external_url text,
  mime_type text,
  alt_text text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint media_source_check check (
    (source_type = 'storage' and storage_bucket is not null and storage_path is not null)
    or (source_type = 'external' and external_url is not null)
  )
);

create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  category text not null,
  description text not null,
  icon_key text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text not null,
  image_media_id uuid references public.media(id) on delete set null,
  github_url text,
  youtube_video_id text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.project_skill_tags (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  skill_id uuid references public.skills(id) on delete set null,
  label text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  unique (project_id, label)
);

create table if not exists public.timeline_entries (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  organization_name text not null,
  entry_type text not null check (entry_type in ('work', 'education')),
  role_title text not null,
  tech_stack text,
  summary text not null,
  date_range text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.personas (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  label text not null,
  avatar_media_id uuid references public.media(id) on delete set null,
  background_media_id uuid references public.media(id) on delete set null,
  top_picks_group_key text not null,
  continue_watching_group_key text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.persona_recommendations (
  id uuid primary key default gen_random_uuid(),
  slot_group text not null check (slot_group in ('top_picks', 'continue_watching')),
  recommendation_group_key text not null,
  title text not null,
  route text not null,
  icon_key text,
  media_id uuid references public.media(id) on delete set null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  unique (slot_group, recommendation_group_key, sort_order)
);

create table if not exists public.content_items (
  id uuid primary key default gen_random_uuid(),
  section text not null check (section in ('reading', 'music')),
  item_type text not null check (item_type in ('book', 'song', 'collection')),
  slug text not null unique,
  title text,
  subtitle text,
  description text,
  embed_url text,
  media_id uuid references public.media(id) on delete set null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_project_skill_tags_project_id on public.project_skill_tags(project_id);
create index if not exists idx_persona_recommendations_group on public.persona_recommendations(slot_group, recommendation_group_key, sort_order);
create index if not exists idx_content_items_section on public.content_items(section, item_type, sort_order);

drop trigger if exists set_media_updated_at on public.media;
create trigger set_media_updated_at
before update on public.media
for each row execute function public.set_updated_at();

drop trigger if exists set_skills_updated_at on public.skills;
create trigger set_skills_updated_at
before update on public.skills
for each row execute function public.set_updated_at();

drop trigger if exists set_projects_updated_at on public.projects;
create trigger set_projects_updated_at
before update on public.projects
for each row execute function public.set_updated_at();

drop trigger if exists set_timeline_entries_updated_at on public.timeline_entries;
create trigger set_timeline_entries_updated_at
before update on public.timeline_entries
for each row execute function public.set_updated_at();

drop trigger if exists set_personas_updated_at on public.personas;
create trigger set_personas_updated_at
before update on public.personas
for each row execute function public.set_updated_at();

drop trigger if exists set_content_items_updated_at on public.content_items;
create trigger set_content_items_updated_at
before update on public.content_items
for each row execute function public.set_updated_at();

alter table public.media enable row level security;
alter table public.skills enable row level security;
alter table public.projects enable row level security;
alter table public.project_skill_tags enable row level security;
alter table public.timeline_entries enable row level security;
alter table public.personas enable row level security;
alter table public.persona_recommendations enable row level security;
alter table public.content_items enable row level security;

drop policy if exists "Public read media" on public.media;
create policy "Public read media"
on public.media for select
using (true);

drop policy if exists "Public read skills" on public.skills;
create policy "Public read skills"
on public.skills for select
using (true);

drop policy if exists "Public read projects" on public.projects;
create policy "Public read projects"
on public.projects for select
using (true);

drop policy if exists "Public read project skill tags" on public.project_skill_tags;
create policy "Public read project skill tags"
on public.project_skill_tags for select
using (true);

drop policy if exists "Public read timeline entries" on public.timeline_entries;
create policy "Public read timeline entries"
on public.timeline_entries for select
using (true);

drop policy if exists "Public read personas" on public.personas;
create policy "Public read personas"
on public.personas for select
using (true);

drop policy if exists "Public read persona recommendations" on public.persona_recommendations;
create policy "Public read persona recommendations"
on public.persona_recommendations for select
using (true);

drop policy if exists "Public read content items" on public.content_items;
create policy "Public read content items"
on public.content_items for select
using (true);

insert into storage.buckets (id, name, public)
values ('portfolio-public', 'portfolio-public', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "Public read portfolio public bucket" on storage.objects;
create policy "Public read portfolio public bucket"
on storage.objects for select
using (bucket_id = 'portfolio-public');
