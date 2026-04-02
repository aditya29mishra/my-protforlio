alter table public.skills
add column if not exists is_active boolean not null default true;

alter table public.timeline_entries
add column if not exists is_active boolean not null default true;

update public.skills
set is_active = true
where is_active is null;

update public.timeline_entries
set is_active = true
where is_active is null;
