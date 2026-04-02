# React + Supabase Portfolio

This repository contains a portfolio application built with React on the frontend, Supabase for data and media delivery, and Firebase Hosting for deployment. The project started as a hardcoded single-page prototype and was refactored into a data-driven system with a normalized backend schema, a reusable service layer, and a production-focused media pipeline.

The app is designed to behave more like a content product than a static portfolio. Projects, skills, timeline entries, persona recommendations, music embeds, and reading content are loaded from Supabase instead of being embedded directly in UI modules. Media is served from Supabase Storage and rendered through an optimized image component with lazy loading, skeleton states, and stable layout sizing.

## Project Overview

This app presents portfolio content through a persona-based browsing experience. Visitors can explore projects, technical skills, work experience, reading recommendations, music collections, and interactive routes from a single React application.

What makes it different from a basic portfolio:

- Content is data-driven and loaded from Supabase instead of being hardcoded into components.
- Personas drive profile-specific recommendations and background media.
- Media is managed separately from structured content and resolved through a shared storage helper.
- The frontend is organized around hooks and services rather than page-local data files.
- Rendering has been tuned with route-level lazy loading, React Query caching, memoization, progressive rendering, and an optimized image pipeline.

## Architecture

```text
React frontend
  -> hooks
  -> services
  -> Supabase client
  -> PostgreSQL tables
  -> Supabase Storage
```

### Data Flow

1. Route-level pages call feature hooks such as `useProjects`, `useSkills`, `useTimeline`, `usePersona`, `useReadingContent`, and `useMusicContent`.
2. Hooks delegate data access to service modules under `src/services/`.
3. Services use the shared Supabase client from [src/services/supabaseClient.js](/D:/my%20portfolo/my-protforlio/src/services/supabaseClient.js) to query PostgreSQL tables and related media references.
4. Media records are normalized and converted into usable public URLs by [src/services/mediaUtils.js](/D:/my%20portfolo/my-protforlio/src/services/mediaUtils.js).
5. Components render the final shaped data and use [src/components/SmartImage.js](/D:/my%20portfolo/my-protforlio/src/components/SmartImage.js) for image loading and layout stability.

### Separation of Concerns

- `pages/` compose route-level views.
- `components/` handle UI rendering only.
- `hooks/` own query orchestration and view-friendly state.
- `services/` contain Supabase queries and response mapping.
- `supabase/` contains schema, seed data, storage manifest, and upload tooling.
- `scripts/` contains build-time asset optimization tooling.

## Tech Stack

- React 18
- React Router DOM
- Supabase JavaScript client
- Supabase PostgreSQL
- Supabase Storage
- Firebase Hosting
- TanStack React Query
- Sharp
- React Icons
- react-vertical-timeline-component
- Three.js for game routes

## Features

- Dynamic projects, skills, timeline entries, personas, reading content, and music content loaded from Supabase
- Persona-based browsing model with profile-specific recommendations
- Centralized media model backed by Supabase Storage and external media URLs where appropriate
- Route-level lazy loading with `React.lazy` and `Suspense`
- Query caching and prefetching through TanStack React Query
- Smart image loading with lazy loading, skeleton placeholders, stable aspect ratios, and shared observers
- Progressive rendering for media-heavy lists to reduce initial DOM work
- Error boundary protection at the app shell

## Folder Structure

```text
src/
  components/   Reusable UI components such as cards, rows, banners, and SmartImage
  pages/        Route-level screens for browse, projects, skills, reading, music, and contact
  hooks/        React Query hooks and view-specific data orchestration
  services/     Supabase client, query modules, media URL resolution, and data mappers
  styles/       Component and page stylesheets
  lib/          Shared frontend infrastructure such as the React Query client
  assets/       Source assets used for optimization and storage upload workflows
  games/        Interactive game routes loaded lazily

supabase/
  migrations/   Database schema and follow-up migration files
  seed.sql      Seed data for portfolio tables
  scripts/      Storage upload tooling
  storage/      Asset upload manifest

scripts/
  optimize-images.mjs   Sharp-based image optimization pipeline for storage uploads
```

## Data Model

The Supabase schema is defined in:

- [20260402110445_create_portfolio_schema.sql](/D:/my%20portfolo/my-protforlio/supabase/migrations/20260402110445_create_portfolio_schema.sql)
- [20260402111833_add_projects_status.sql](/D:/my%20portfolo/my-protforlio/supabase/migrations/20260402111833_add_projects_status.sql)
- [20260402113320_add_skills_timeline_is_active.sql](/D:/my%20portfolo/my-protforlio/supabase/migrations/20260402113320_add_skills_timeline_is_active.sql)

### Tables

#### `media`

Stores media metadata for both storage-backed and externally hosted assets.

- `source_type` distinguishes `storage` from `external`
- `storage_bucket` and `storage_path` identify files in Supabase Storage
- `external_url` supports assets that remain off-platform

#### `projects`

Stores project metadata and connects to a single primary media record.

- `image_media_id -> media.id`
- `status` controls published visibility

#### `project_skill_tags`

Links projects to labeled skill tags.

- `project_id -> projects.id`
- `skill_id -> skills.id`

#### `skills`

Stores skills and display metadata used by the skills page.

- grouped in the UI by `category`
- `is_active` controls visibility

#### `timeline_entries`

Stores work and education timeline records.

- `entry_type` distinguishes work from education
- `is_active` controls visibility

#### `personas`

Stores profile variants used by the browse flow and profile pages.

- `avatar_media_id -> media.id`
- `background_media_id -> media.id`
- recommendation group keys link the persona to shared recommendation sets

#### `persona_recommendations`

Stores recommendation cards for the persona UI.

- `slot_group` identifies whether a card appears in `top_picks` or `continue_watching`
- `media_id -> media.id`

#### `content_items`

Stores reading and music content.

- `section` identifies whether the item belongs to `reading` or `music`
- `item_type` distinguishes `book`, `song`, and `collection`
- `media_id -> media.id` is used for reading covers

### Relationship Summary

- `media` is the shared source of truth for image, GIF, audio, and PDF metadata.
- `projects`, `personas`, `persona_recommendations`, and `content_items` all reference `media`.
- `project_skill_tags` links projects to `skills`.
- `personas` select recommendation groups, and `persona_recommendations` stores the cards within those groups.

## Environment Setup

Create a local `.env` file based on [.env.example](/D:/my%20portfolo/my-protforlio/.env.example):

```env
REACT_APP_SUPABASE_URL=your_supabase_project_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

The client also supports `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as fallbacks, but the current app runs on Create React App and primarily expects the `REACT_APP_*` variables.

For storage uploads, set these additional shell environment variables before running the upload script:

```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

## Local Development

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm start
```

Create a production build:

```bash
npm run build
```

Run the image optimization pipeline:

```bash
npm run optimize:images
```

## Database Setup

This repository does not use a single `schema.sql`. The database is defined through migration files under [supabase/migrations](/D:/my%20portfolo/my-protforlio/supabase/migrations).

Apply the schema in this order:

1. [20260402110445_create_portfolio_schema.sql](/D:/my%20portfolo/my-protforlio/supabase/migrations/20260402110445_create_portfolio_schema.sql)
2. [20260402111833_add_projects_status.sql](/D:/my%20portfolo/my-protforlio/supabase/migrations/20260402111833_add_projects_status.sql)
3. [20260402113320_add_skills_timeline_is_active.sql](/D:/my%20portfolo/my-protforlio/supabase/migrations/20260402113320_add_skills_timeline_is_active.sql)

Then seed the data with:

- [seed.sql](/D:/my%20portfolo/my-protforlio/supabase/seed.sql)

You can run these files through the Supabase SQL Editor or through your local Supabase CLI workflow, depending on how you manage the project.

## Media Pipeline

Source media lives under [src/assets](/D:/my%20portfolo/my-protforlio/src/assets). Media delivery is split into two stages:

1. [scripts/optimize-images.mjs](/D:/my%20portfolo/my-protforlio/scripts/optimize-images.mjs) scans `src/assets`, converts image files to WebP, resizes them, and writes the optimized output into `optimized-assets/`.
2. [upload-assets.mjs](/D:/my%20portfolo/my-protforlio/supabase/scripts/upload-assets.mjs) uploads optimized images and original non-image assets to the `portfolio-public` storage bucket.

Path conventions:

- Images are uploaded as `portfolio-public/assets/<filename>.webp`
- Non-image files keep their original extension
- Media references in the database store bucket and path information, and the frontend resolves them into public URLs

## Performance Optimizations

The app includes several performance-focused systems:

- `SmartImage` for lazy loading, skeleton placeholders, fade-in behavior, stable aspect ratios, and shared intersection observers
- React Query caching with a default `staleTime` of 10 minutes and `gcTime` of 30 minutes
- Route-level code splitting through `React.lazy`
- Warmup prefetching for personas and projects, with secondary data loaded during idle time
- Progressive rendering via `useProgressiveItems` to limit initial DOM size for list-heavy views
- Memoization and stable callbacks across key list and card components to reduce rerender cascades

## Deployment

Firebase Hosting is configured in [firebase.json](/D:/my%20portfolo/my-protforlio/firebase.json) to serve the built SPA with a rewrite to `index.html`.

Build the app:

```bash
npm run build
```

Deploy to Firebase Hosting:

```bash
firebase deploy --only hosting
```

The default Firebase project target is defined in [.firebaserc](/D:/my%20portfolo/my-protforlio/.firebaserc).

## Future Improvements

These are natural next steps for the current architecture:

- authenticated admin workflows for content updates
- a write-side management UI for portfolio data
- richer CMS capabilities for editing projects, personas, and media without manual SQL
- stronger deployment automation around storage sync and migration rollout

## Contributing

This is a personal portfolio codebase, but contributions are easier to manage if they follow the current architecture:

1. Keep UI components presentation-focused.
2. Put new data access in `services/` and query orchestration in `hooks/`.
3. Avoid reintroducing hardcoded content into route components.
4. Run `npm run build` before opening a merge request.
5. If you change media handling, verify both image optimization and storage upload paths.
