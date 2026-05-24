# TrackFix AI

Production-ready SaaS for GTM, GA4, Google Ads, and Search Console automation with multi-tenant agency support.

## Stack

- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS** + **shadcn/ui**
- **Prisma** + **PostgreSQL**
- **Firebase Authentication** (Google login — email & profile only)
- **Prisma** + **PostgreSQL**
- **Vercel** deploy ready

## Getting started

```bash
cp .env.example .env
# Fill DATABASE_URL, AUTH_SECRET, Firebase client + admin keys

npm install
npx prisma db push
npm run db:seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Plans

| Feature | MVP | Pro | Agency |
|---------|-----|-----|--------|
| GTM containers | 1 | 10 | Unlimited |
| GA4 properties | 1 | 10 | Unlimited |
| Google Ads accounts | — | 3 | Unlimited |
| Search Console sites | 1 | 5 | Unlimited |
| Team members | 1 | 5 | Unlimited |
| Client workspaces | — | — | Yes |

## Project structure

```
src/
├── app/                    # Routes (marketing, auth, dashboard, API)
├── components/             # UI + layout + feature components
├── config/                 # Plans, navigation, site metadata
├── lib/                    # Prisma, auth, utils, validations
├── services/               # Domain services (GTM, GA4, Ads, GSC)
├── types/                  # Shared TypeScript types
└── hooks/                  # React hooks
prisma/
└── schema.prisma           # Full data model
```

## Deploy to Vercel

1. Import repo to Vercel
2. Add environment variables from `.env.example`
3. Attach Vercel Postgres or external PostgreSQL
4. Run `prisma migrate deploy` in build or via Vercel integration

## License

Proprietary — TrackFix AI
