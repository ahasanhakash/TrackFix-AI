# TrackFix AI — Architecture

## Layers

```
┌─────────────────────────────────────────────────────────────┐
│  Presentation (Next.js App Router)                          │
│  src/app — pages, layouts, API routes, server actions       │
│  src/components — UI, marketing, feature components         │
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────┐
│  Application services                                       │
│  src/services — GTM, GA4, Google Ads, Search Console, Jobs  │
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────┐
│  Data access (Prisma)                                       │
│  prisma/schema.prisma — multi-tenant PostgreSQL model       │
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────┐
│  External APIs (stubs → production)                         │
│  Google Tag Manager, GA4 Admin, Google Ads, Search Console  │
└─────────────────────────────────────────────────────────────┘
```

## Multi-tenancy

- **User** → **OrganizationMember** → **Organization**
- All module resources are scoped by `organizationId`
- Dashboard routes: `/dashboard/[orgSlug]/...`
- Plan limits enforced in `src/config/plans.ts` and services

## Auth

- **Firebase Authentication** — Google sign-in (email + profile only)
- **JWT session cookies** — edge-safe middleware via `jose`
- **Separate Google integration** — `/connect/google` for Ads/GTM/GA4/GSC OAuth (post-verification)

## Module map

| Module | Service | Routes |
|--------|---------|--------|
| GTM | `src/services/gtm/` | `/dashboard/[org]/gtm` |
| GA4 | `src/services/ga4/` | `/dashboard/[org]/ga4` |
| Google Ads | `src/services/google-ads/` | `/dashboard/[org]/google-ads` |
| Search Console | `src/services/search-console/` | `/dashboard/[org]/search-console` |
| Agency | `src/services/agency/` | `/dashboard/[org]/agency` |

## Jobs

Long-running Google API work is modeled as `AutomationJob` records. Services create jobs, update status, and store output JSON for auditability.

## Deployment (Vercel)

1. Set env vars from `.env.example` (Firebase client + admin, `AUTH_SECRET`, `DATABASE_URL`)
2. PostgreSQL: Vercel Postgres, Neon, or Supabase
3. `prisma db push` or `prisma migrate deploy` on release
4. Firebase: add authorized domain (your Vercel URL)
5. Google integration OAuth (later): `GOOGLE_INTEGRATION_*` → `/api/integrations/google/callback`

## Next implementation steps

1. Wire real Google API clients in `src/lib/google/`
2. Token encryption with `ENCRYPTION_KEY` for `Integration` model
3. Background workers (Vercel Cron or Inngest) for `AutomationJob` processing
4. Stripe billing for MVP / Pro / Agency plans
