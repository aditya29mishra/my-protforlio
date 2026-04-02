-- HARDEN RLS POLICIES FOR ADMIN
-- IMPORTANT: Replace 'YOUR_ADMIN_UUID' strictly with your Supabase auth.uid() before executing.

-- 1. MEDIA TABLE
drop policy if exists "Auth write media" on public.media;
create policy "Admin full access"
on public.media
for all
to authenticated
using (auth.uid() = 'b62d24da-acde-46df-b8d3-0538f3f65e09'::uuid)
with check (auth.uid() = 'b62d24da-acde-46df-b8d3-0538f3f65e09'::uuid);

-- 2. PROJECTS TABLE
drop policy if exists "Auth write projects" on public.projects;
create policy "Admin full access"
on public.projects
for all
to authenticated
using (auth.uid() = 'b62d24da-acde-46df-b8d3-0538f3f65e09'::uuid)
with check (auth.uid() = 'b62d24da-acde-46df-b8d3-0538f3f65e09'::uuid);

-- 3. SKILLS TABLE
drop policy if exists "Auth write skills" on public.skills;
create policy "Admin full access"
on public.skills
for all
to authenticated
using (auth.uid() = 'b62d24da-acde-46df-b8d3-0538f3f65e09'::uuid)
with check (auth.uid() = 'b62d24da-acde-46df-b8d3-0538f3f65e09'::uuid);

-- 4. TIMELINE ENTRIES TABLE
drop policy if exists "Auth write timeline entries" on public.timeline_entries;
create policy "Admin full access"
on public.timeline_entries
for all
to authenticated
using (auth.uid() = 'b62d24da-acde-46df-b8d3-0538f3f65e09'::uuid)
with check (auth.uid() = 'b62d24da-acde-46df-b8d3-0538f3f65e09'::uuid);
