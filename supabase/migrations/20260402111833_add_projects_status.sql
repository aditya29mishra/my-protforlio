alter table public.projects
add column if not exists status text not null default 'published'
check (status in ('draft', 'published', 'archived'));

update public.projects
set status = 'published'
where status is null;
