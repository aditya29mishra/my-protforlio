---
trigger: always_on
---

Strict layered architecture:

UI → hooks → services → supabase → database

Responsibilities:
- UI: presentation only
- hooks: data fetching (React Query)
- services: business logic
- supabase: database interaction