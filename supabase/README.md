# Supabase Backend Setup

This directory contains the Phase 2 backend foundation for the portfolio app.

## Included

- `migrations/20260402110445_create_portfolio_schema.sql`
- `seed.sql`
- `storage/upload-manifest.json`
- `scripts/upload-assets.mjs`

## Suggested next commands once real Supabase credentials are available

```bash
npx supabase link --project-ref <your-project-ref>
npx supabase db push
node supabase/scripts/upload-assets.mjs
```

The frontend is not connected yet in this phase. `src/services/supabaseClient.js` is scaffolded only.
