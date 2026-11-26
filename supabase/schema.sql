-- ============================================================
-- auron.ae — Supabase schema
-- Run this once in: Dashboard → SQL Editor → New query → Run
-- ============================================================

create extension if not exists "pgcrypto";

-- ---- Projects ------------------------------------------------
create table if not exists public.projects (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null,
  title         text not null,
  summary       text,
  description   text,
  category      text,
  media_type    text,              -- youtube | video | image | gallery
  media_url     text,
  youtube_url   text,
  thumbnail_url text,
  gallery       jsonb default '[]'::jsonb,
  year          text,
  role          text,
  tools         jsonb default '[]'::jsonb,
  client_label  text,
  external_link text,
  alt_text      text,
  featured      boolean default false,
  status        text default 'draft',  -- draft | published
  sort_order    integer default 0,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- ---- Site settings ------------------------------------------
create table if not exists public.site_settings (
  id         uuid primary key default gen_random_uuid(),
  key        text unique not null,
  value      jsonb,
  updated_at timestamptz default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists projects_set_updated_at on public.projects;
create trigger projects_set_updated_at
  before update on public.projects
  for each row execute function public.set_updated_at();

drop trigger if exists site_settings_set_updated_at on public.site_settings;
create trigger site_settings_set_updated_at
  before update on public.site_settings
  for each row execute function public.set_updated_at();

-- ---- Row Level Security -------------------------------------
alter table public.projects      enable row level security;
alter table public.site_settings enable row level security;

drop policy if exists "Public read published projects" on public.projects;
create policy "Public read published projects"
  on public.projects for select
  using (status = 'published');

drop policy if exists "Authenticated full access to projects" on public.projects;
create policy "Authenticated full access to projects"
  on public.projects for all
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Public read site settings" on public.site_settings;
create policy "Public read site settings"
  on public.site_settings for select
  using (true);

drop policy if exists "Authenticated full access to settings" on public.site_settings;
create policy "Authenticated full access to settings"
  on public.site_settings for all
  to authenticated
  using (true)
  with check (true);

-- ---- Storage: public media bucket ---------------------------
insert into storage.buckets (id, name, public)
values ('portfolio-media', 'portfolio-media', true)
on conflict (id) do update set public = true;

drop policy if exists "Public read portfolio media" on storage.objects;
create policy "Public read portfolio media"
  on storage.objects for select
  using (bucket_id = 'portfolio-media');

drop policy if exists "Authenticated upload portfolio media" on storage.objects;
create policy "Authenticated upload portfolio media"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'portfolio-media');

drop policy if exists "Authenticated update portfolio media" on storage.objects;
create policy "Authenticated update portfolio media"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'portfolio-media');

drop policy if exists "Authenticated delete portfolio media" on storage.objects;
create policy "Authenticated delete portfolio media"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'portfolio-media');

-- ---- Seed default site config (skip if already present) -----
insert into public.site_settings (key, value)
values (
  'config',
  '{
    "brand": "auron.ae",
    "creatorName": "Sarang",
    "descriptor": "Independent Visual Creator",
    "siteTitle": "auron.ae — Video Editing & Graphic Design",
    "metaDescription": "Sarang is an independent video editor, motion designer and graphic designer — the creator behind auron.ae.",
    "heroEyebrow": "INDEPENDENT CREATIVE / VIDEO + DESIGN",
    "heroHeadline": "Visuals with a little more character.",
    "heroSupporting": "I''m Sarang, the creator behind auron.ae. I work across video editing, motion graphics and graphic design, creating visuals for digital platforms, creators and brands.",
    "heroCta": "Explore the archive",
    "heroCtaSecondary": "Work with me",
    "aboutBio": "I''m Sarang — the creator behind auron.ae. I work at the intersection of video and design to craft visuals that move people. Based wherever the work takes me.",
    "aboutBioLong": "auron.ae is my creative identity and the home for my work in video editing, motion graphics and graphic design. I build visuals for digital platforms, creators, and brands — from sharp social edits to full motion pieces.",
    "email": "",
    "socials": {
      "instagram": "",
      "youtube": "",
      "behance": "",
      "linkedin": ""
    },
    "footerText": "Made by Sarang · auron.ae",
    "availabilityMessage": ""
  }'::jsonb
)
on conflict (key) do nothing;
