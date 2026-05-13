# Security Checklist

- Enforce HTTPS through Vercel and Cloudflare.
- Keep secrets in `.env.local`; commit only `.env.example`.
- Validate all API inputs with Zod.
- Sanitise car registrations before DB, cache or DVLA calls.
- Add authenticated admin/B2B sessions through NextAuth.
- Add Redis-backed rate limits to lookup, login and checkout endpoints.
- Use Cloudflare WAF/IP blocking for high-volume abuse.
- Verify Stripe webhook signatures before fulfilment.
- Run external Sucuri or Pentest Tools scan before launch.
