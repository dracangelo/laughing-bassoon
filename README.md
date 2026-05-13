# Ace Turbo

Next.js 14, TypeScript and Tailwind scaffold for the Ace Turbo website described in `task.md`.

The current implementation includes:

- Public homepage, turbo search, product detail pages, contact page, blog system, cart, checkout, account orders, and invoice downloads
- Admin dashboard for turbos, orders, users/IP blocks, lookup reporting, SEO, eBay listings, and audit scheduling
- Persistent local JSON-backed storage for development, with Prisma/MySQL schema retained for production migration
- Registration/login/logout flows with JWT cookie auth and middleware-protected admin/B2B/account areas
- Cart persistence, order creation, invoice PDF generation, email logging/SendGrid delivery, Stripe checkout sessions, and Stripe webhook fulfilment
- Registration lookup sanitisation, logging, Redis-backed cache/rate limiting when configured, and signed export protection for data-heavy product exports
- GA4/GTM hooks, sitemap, robots, Open Graph/Twitter metadata, and product Schema.org markup
- Cloudflare IP block sync hook, migration script for legacy data, and external audit tracking endpoint

## Run

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env.local` and fill production credentials before enabling real external integrations.

## Development Access

- Seeded admin login: `admin@aceturbo.co.uk`
- Seeded admin password: `ChangeMe12345!`
