# Ace Turbo API Notes

- `POST /api/car-lookup` sanitises registrations, checks cache, then calls DVLA when needed.
- `GET /api/turbos` searches stock by vehicle fields or part number.
- `POST /api/turbos` validates product data for admin entry.
- `POST /api/orders` validates checkout payloads and prepares invoice workflow.
- `POST /api/ebay` creates a Trading API-ready listing draft.
- `POST /api/seo` creates canonical product and campaign URLs.
- `GET /api/admin/lookup-stats` returns API/DB/cache lookup totals.
