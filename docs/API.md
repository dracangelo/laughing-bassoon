# Ace Turbo API Notes

- `POST /api/car-lookup` sanitises registrations, checks cache, then calls DVLA when needed.
- `GET /api/turbos` searches stock by vehicle fields or part number.
- `POST /api/turbos` validates product data for admin entry.
- `POST /api/orders` validates checkout payloads and prepares invoice workflow.
- `POST /api/ebay` creates a Trading API-ready listing draft.
- `POST /api/seo` creates canonical product and campaign URLs.
- `GET /api/admin/lookup-stats` returns API/DB/cache lookup totals.
- `GET /api/account/sessions` returns the current user's tracked sessions.
- `DELETE /api/account/sessions` revokes a session or all other sessions for the current user.
- `GET /api/admin/sessions` returns all tracked sessions for administrators.
- `DELETE /api/admin/sessions` revokes one session or all sessions for a user.

## Operations

- `npm run migrate:existing` imports `data/existing-data.json` into Prisma/MySQL when `DATABASE_URL` is real, otherwise into the local JSON development store.
- `npm run cloudflare:configure` applies baseline Cloudflare HTTPS/security settings when Cloudflare credentials are present.
- `npm run audit:external` writes public external security scan output to `.data/security-audit-report.json`.
