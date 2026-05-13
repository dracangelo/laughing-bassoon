# Ace Turbo

Next.js 14, TypeScript and Tailwind scaffold for the Ace Turbo website described in `task.md`.

The current implementation includes the Turboactive-inspired homepage, mobile-ready layout, sanitised reg lookup flow, SEO/social metadata, MySQL Prisma schema, admin route structure, API validation stubs, middleware IP/auth hooks and integration placeholders for DVLA, eBay, Stripe, SendGrid, Redis and Cloudflare.

## Run

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env.local` and fill production credentials before enabling real external integrations.
