# Security Checklist

- Enforce HTTPS through Vercel and Cloudflare.
- Keep secrets in `.env.local`; commit only `.env.example`.
- Validate all API inputs with Zod.
- Sanitise car registrations before DB, cache or DVLA calls.
- Add authenticated admin/B2B sessions through NextAuth.
- Add Redis-backed rate limits to lookup, login and checkout endpoints.
- Use Cloudflare WAF/IP blocking for high-volume abuse.
- Verify Stripe webhook signatures before fulfilment.
- Run `npm run cloudflare:configure` with `CF_API_TOKEN` and `CF_ZONE_ID` to apply baseline HTTPS/security settings.
- Run `npm run audit:external` with `AUDIT_TARGET_URL` after deployment to capture automated public scan output.
- Run authenticated Sucuri or Pentest Tools scans before launch and attach the exported reports to `.data/security-audit-report.json` or the launch ticket.
