# Ace Turbo Website — Project Task Document

> **Project:** Ace Turbo — Premier Turbocharger Distributor Website  
> **Version:** 1.0  
> **Status:** Planning / Pre-Development  
> **Reference Design:** https://www.turboactive.com/ (design inspiration only — do not copy)

---

## 1. Tech Stack

| Layer | Technology | Reason |
|---|---|---|
| Frontend Framework | Next.js 14 (React) | SSR/SSG for SEO, mobile-ready, fast |
| Language | TypeScript | Type safety, fewer runtime bugs |
| Styling | Tailwind CSS | Rapid responsive UI, mobile-first |
| Backend / API | Next.js API Routes + Node.js | Unified codebase, DVLA API integration |
| Database | MySQL 8.x | As specified; relational, robust |
| ORM | Prisma | Type-safe DB queries, migrations |
| Cache Layer | Redis | Car reg lookup caching, session store |
| Auth | NextAuth.js + JWT | Secure user/admin/B2B sessions |
| Payments | Stripe | PCI-compliant shopping cart |
| Hosting (Frontend) | Vercel | Auto-scaling, global CDN |
| Hosting (DB) | AWS RDS (MySQL) | Managed, secure, backups |
| Security / CDN | Cloudflare | IP blocking, DDoS, WAF |
| Email | SendGrid | Transactional emails, invoices |
| PDF / Invoices | React-PDF / PDFKit | Invoice generation |
| Analytics | Google Analytics 4 + Tag Manager | Visitor tracking, AdWords |
| SEO | Next.js Sitemap + Schema.org | Structured data, Google indexing |
| Form Validation | Zod + React Hook Form | Strict field-level validation |
| eBay Integration | eBay Trading API | Listing creation from turbo records |
| DVLA API | DVLA Vehicle Enquiry Service | Car reg lookups |
| Testing | Jest + Playwright | Unit + E2E security/functional tests |
| External Security Audit | Pentest Tools / Sucuri | Pre-launch security scan |

---

## 2. Project Folder Structure

```
ace-turbo/
├── .env.local                    # Environment variables (never committed)
├── .env.example                  # Template for env vars
├── next.config.js                # Next.js config
├── tailwind.config.ts            # Tailwind config
├── tsconfig.json                 # TypeScript config
├── prisma/
│   ├── schema.prisma             # DB schema (turbos, cars, users, orders)
│   └── migrations/               # Auto-generated DB migrations
│
├── public/
│   ├── images/                   # Static images, logos
│   ├── icons/                    # Favicon, PWA icons
│   └── robots.txt                # SEO robots file
│
├── src/
│   ├── app/                      # Next.js 14 App Router
│   │   ├── layout.tsx            # Root layout (header, footer, cookies)
│   │   ├── page.tsx              # Homepage (carousel, reg lookup, brands)
│   │   ├── turbos/
│   │   │   ├── page.tsx          # Turbo search/browse page
│   │   │   └── [slug]/page.tsx   # Individual turbo product page
│   │   ├── cart/
│   │   │   └── page.tsx          # Shopping cart
│   │   ├── checkout/
│   │   │   └── page.tsx          # Checkout + Stripe
│   │   ├── account/
│   │   │   ├── page.tsx          # User account dashboard
│   │   │   ├── orders/page.tsx   # Order history
│   │   │   └── invoices/page.tsx # Invoice downloads
│   │   ├── b2b/
│   │   │   └── page.tsx          # B2B area (protected)
│   │   ├── admin/                # Internal admin (NOT public)
│   │   │   ├── layout.tsx        # Admin layout + auth guard
│   │   │   ├── page.tsx          # Admin dashboard
│   │   │   ├── turbos/page.tsx   # Turbo data entry / management
│   │   │   ├── orders/page.tsx   # Order management
│   │   │   ├── users/page.tsx    # User management / IP blocking
│   │   │   ├── ebay/page.tsx     # eBay listing manager
│   │   │   ├── car-lookup/
│   │   │   │   ├── page.tsx      # View car reg lookup results
│   │   │   │   └── stats/page.tsx # API vs DB vs cache lookup stats
│   │   │   └── seo/page.tsx      # SEO link generator
│   │   ├── api/                  # Backend API routes
│   │   │   ├── auth/[...nextauth]/route.ts   # Auth endpoints
│   │   │   ├── turbos/
│   │   │   │   ├── route.ts      # GET (search), POST (create)
│   │   │   │   └── [id]/route.ts # GET, PUT, DELETE single turbo
│   │   │   ├── car-lookup/
│   │   │   │   └── route.ts      # DVLA API + DB + cache lookup
│   │   │   ├── cart/
│   │   │   │   └── route.ts      # Cart operations
│   │   │   ├── orders/
│   │   │   │   └── route.ts      # Order creation + invoice trigger
│   │   │   ├── ebay/
│   │   │   │   └── route.ts      # eBay listing creation
│   │   │   ├── seo/
│   │   │   │   └── route.ts      # SEO link generation
│   │   │   ├── admin/
│   │   │   │   ├── users/route.ts       # User/IP management
│   │   │   │   └── lookup-stats/route.ts # Lookup statistics
│   │   │   └── webhooks/
│   │   │       └── stripe/route.ts      # Stripe payment webhook
│   │
│   ├── components/
│   │   ├── ui/                   # Reusable UI primitives
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── Modal.tsx
│   │   │   └── Table.tsx
│   │   ├── layout/
│   │   │   ├── Header.tsx        # Nav, search bar, mobile menu
│   │   │   ├── Footer.tsx
│   │   │   └── CookieBanner.tsx  # GDPR cookie consent
│   │   ├── homepage/
│   │   │   ├── HeroCarousel.tsx  # Full-width image carousel
│   │   │   ├── RegLookupForm.tsx # Car reg input + vehicle search
│   │   │   ├── BrandLogos.tsx    # Garrett, BorgWarner, IHI, etc.
│   │   │   └── FeaturedTurbos.tsx
│   │   ├── turbos/
│   │   │   ├── TurboCard.tsx
│   │   │   ├── TurboFilter.tsx
│   │   │   └── TurboDetail.tsx
│   │   ├── cart/
│   │   │   ├── CartDrawer.tsx
│   │   │   └── CartItem.tsx
│   │   └── admin/
│   │       ├── TurboDataEntry.tsx    # Friendly data entry form
│   │       ├── LookupStatsPanel.tsx  # API/DB/cache stat display
│   │       └── EbayListingForm.tsx
│   │
│   ├── lib/
│   │   ├── db.ts                 # Prisma client instance
│   │   ├── redis.ts              # Redis client instance
│   │   ├── dvla.ts               # DVLA API integration
│   │   ├── ebay.ts               # eBay API integration
│   │   ├── stripe.ts             # Stripe client
│   │   ├── email.ts              # SendGrid email helpers
│   │   ├── invoice.ts            # PDF invoice generator
│   │   ├── sanitize.ts           # Input sanitisation (car reg, forms)
│   │   ├── ipBlock.ts            # IP address blocking logic
│   │   └── seoGenerator.ts       # Auto SEO link builder
│   │
│   ├── middleware.ts             # Auth guards, IP blocking, redirects
│   │
│   ├── hooks/
│   │   ├── useCart.ts
│   │   ├── useCarLookup.ts
│   │   └── useVehicleSearch.ts
│   │
│   ├── types/
│   │   ├── turbo.ts
│   │   ├── vehicle.ts
│   │   ├── order.ts
│   │   └── user.ts
│   │
│   └── validators/               # Zod schemas for all inputs
│       ├── turboSchema.ts
│       ├── carRegSchema.ts
│       ├── orderSchema.ts
│       └── userSchema.ts
│
├── tests/
│   ├── unit/                     # Jest unit tests
│   └── e2e/                      # Playwright end-to-end tests
│
└── docs/
    ├── TASK.md                   # This file
    ├── API.md                    # Internal API documentation
    └── SECURITY.md               # Security checklist
```

---

## 3. Key Libraries & Tools

### Frontend
| Library | Purpose |
|---|---|
| `next` 14 | App framework, SSR, routing |
| `react` 18 | UI component library |
| `typescript` | Type safety |
| `tailwindcss` | Utility-first CSS |
| `framer-motion` | Carousel and page animations |
| `react-hook-form` | Form state management |
| `zod` | Schema validation (frontend + backend) |
| `swiper` | Homepage carousel / image slider |
| `next-seo` | Meta tags, Open Graph, Twitter cards |

### Backend & Data
| Library | Purpose |
|---|---|
| `prisma` | ORM for MySQL |
| `ioredis` | Redis client for caching |
| `next-auth` | Authentication + session management |
| `bcryptjs` | Password hashing |
| `jsonwebtoken` | JWT token handling |
| `axios` | HTTP client for DVLA + eBay API calls |

### Payments & Commerce
| Library | Purpose |
|---|---|
| `stripe` | Payment processing |
| `@stripe/react-stripe-js` | Stripe Elements frontend |

### Communication & Documents
| Library | Purpose |
|---|---|
| `@sendgrid/mail` | Transactional emails |
| `@react-pdf/renderer` | Invoice PDF generation |
| `nodemailer` | Backup SMTP email |

### Security
| Library | Purpose |
|---|---|
| `helmet` | HTTP security headers |
| `rate-limiter-flexible` | Rate limiting per IP/user |
| `dompurify` | HTML injection prevention |
| `validator` | Field-level data sanitisation |
| `cloudflare` (platform) | WAF, IP blocking, DDoS protection |

### SEO & Analytics
| Library | Purpose |
|---|---|
| `next-sitemap` | Auto-generated XML sitemap |
| `schema-dts` | Schema.org structured data types |
| Google Analytics 4 | Visitor tracking |
| Google Tag Manager | Analytics + Ads tag management |
| Google Search Console | Indexing & performance |

### Dev & Testing
| Library | Purpose |
|---|---|
| `jest` | Unit testing |
| `playwright` | End-to-end browser testing |
| `eslint` + `prettier` | Code quality |
| `husky` + `lint-staged` | Pre-commit hooks |

---

## 4. Feature List (Initial Scope)

### 4.1 Public Website
- [ ] **Homepage** — Hero carousel, car reg lookup widget, brand logos, featured turbos
- [ ] **Turbo Search** — Filter by Make / Model / Year / Engine / BHP
- [ ] **Car Reg Lookup** — Clean reg input → check DB cache → call DVLA API if not cached → store result
- [ ] **Turbo Product Pages** — SEO-optimised URLs, images, specs, pricing, add to cart
- [ ] **Brand Pages** — Garrett, BorgWarner, IHI, Mitsubishi, Continental, BMTS
- [ ] **Shopping Cart** — Persistent cart, mobile-optimised, secure checkout flow
- [ ] **Checkout** — Stripe payment, address capture, order confirmation email + invoice PDF
- [ ] **User Accounts** — Registration, login, order history, invoice downloads
- [ ] **B2B Area** — Separate login, trade pricing (password-protected)
- [ ] **Contact Page** — Click-to-call feature, contact form
- [ ] **News / Blog** — SEO content pages

### 4.2 Admin Area (Internal — Not Public)
- [ ] **Turbo Data Entry** — Friendly form to add/edit turbos with full validation
- [ ] **Car Reg Lookup Viewer** — View searched plates, matched vehicle details
- [ ] **Lookup Stats Dashboard** — Count of: total lookups / API calls / DB hits / cache hits
- [ ] **Order Management** — View, process, update orders; trigger invoice emails
- [ ] **User Management** — View users, block/unblock IPs, manage sessions
- [ ] **eBay Listing Manager** — Select turbos → auto-generate eBay listings via Trading API
- [ ] **SEO Link Generator** — Create and manage SEO links for all products
- [ ] **IP Block Manager** — Block abusers, set redirect targets per IP

### 4.3 Security & Compliance
- [ ] **GDPR Cookie Consent** — Banner with accept/reject, preference storage
- [ ] **HTML Injection Protection** — DOMPurify + server-side sanitisation on all inputs
- [ ] **Car Reg Sanitisation** — Strip spaces and special characters before API/DB calls
- [ ] **Input Validation** — Zod schemas on every form and API endpoint
- [ ] **Rate Limiting** — Per-IP limits on car reg lookup, login, checkout
- [ ] **IP Blocking & Redirect** — Middleware-level, Cloudflare rules
- [ ] **Competitor Resource Protection** — Signed URLs, login-walls on data-heavy endpoints
- [ ] **External Security Audit** — Run full scan via Pentest Tools or Sucuri pre-launch
- [ ] **HTTPS Everywhere** — Enforced via Cloudflare + Vercel
- [ ] **Content Security Policy** — Restrict script/style sources

### 4.4 SEO & Marketing
- [ ] **Auto-generated SEO URLs** — Per turbo, per make/model combination
- [ ] **XML Sitemap** — Auto-updated on new product additions
- [ ] **Schema.org Product Markup** — For Google Shopping / rich results
- [ ] **Google Analytics 4 + Tag Manager** — Full event tracking
- [ ] **Google AdSense / AdWords Ready** — Placement zones defined in layout
- [ ] **Social Media Meta Tags** — Open Graph + Twitter Card on all pages
- [ ] **Canonical URLs** — Prevent duplicate content penalties

### 4.5 Integrations
- [ ] **DVLA Vehicle Enquiry API** — Fetch vehicle data by registration number
  - API Docs: https://developer-portal.driver-vehicle-licensing.api.gov.uk/apis/vehicle-enquiry-service/vehicle-enquiry-service-description.html
- [ ] **eBay Trading API** — Create listings from turbo database entries
  - Reference: https://aceturbo.co.uk/Ebay_Chra/ and https://aceturbo.co.uk/ebay_turbo/
- [ ] **Stripe Payments API** — Full checkout + webhook for order fulfilment
- [ ] **SendGrid** — Order confirmation, invoice, and marketing emails
- [ ] **Cloudflare** — CDN, WAF, analytics, IP management

### 4.6 Data & Database
- [ ] **MySQL schema** — Turbos, vehicles (car reg cache), users, orders, order items, sessions, IP blocks, lookup log
- [ ] **Separate car reg database** — Vehicle data stored independently from turbo data
- [ ] **Lookup logging** — Every car reg lookup recorded with source (API / DB / cache)
- [ ] **Existing data migration** — Import current Ace Turbo database into new schema
- [ ] **Redis cache** — Car reg results cached to reduce DVLA API call costs

---

## 5. Database Schema (Overview)

```
turbos           — id, sku, make, model, year, engine, bhp, type, price, stock, images, seo_slug
vehicles         — id, registration, make, model, year, engine, fuel, colour, source, created_at
lookup_log       — id, registration, source (api|db|cache), timestamp, user_ip
users            — id, email, password_hash, role (customer|b2b|admin), created_at
orders           — id, user_id, status, total, stripe_payment_id, created_at
order_items      — id, order_id, turbo_id, quantity, unit_price
ip_blocks        — id, ip_address, reason, redirect_url, blocked_at
sessions         — managed by NextAuth / Redis
```

---

## 6. Environment Variables Required

```env
# Database
DATABASE_URL=mysql://user:pass@host:3306/aceturbo
REDIS_URL=redis://localhost:6379

# Auth
NEXTAUTH_SECRET=
NEXTAUTH_URL=https://aceturbo.co.uk

# DVLA API
DVLA_API_KEY=
DVLA_API_URL=https://driver-vehicle-licensing.api.gov.uk/vehicle-enquiry/v1/vehicles

# eBay
EBAY_APP_ID=
EBAY_CERT_ID=
EBAY_DEV_ID=
EBAY_AUTH_TOKEN=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=

# SendGrid
SENDGRID_API_KEY=
EMAIL_FROM=orders@aceturbo.co.uk

# Cloudflare
CF_API_TOKEN=
CF_ZONE_ID=

# Google
NEXT_PUBLIC_GA_ID=
```

---

## 7. Development Phases

### Phase 1 — Foundation (Weeks 1–2)
- Project scaffolding, repo setup, CI/CD pipeline
- MySQL schema + Prisma setup
- Auth (login, register, admin guard)
- Cloudflare + hosting setup

### Phase 2 — Core Website (Weeks 3–5)
- Homepage (carousel, reg lookup, brand logos)
- Turbo search + product pages
- Shopping cart + Stripe checkout
- Order confirmation emails + invoices

### Phase 3 — Admin Area (Weeks 6–7)
- Turbo data entry system
- Car reg lookup viewer + stats dashboard
- User + IP management
- eBay listing manager

### Phase 4 — Integrations (Weeks 8–9)
- DVLA API full integration (with sanitisation + caching)
- eBay Trading API listings
- SEO link generator
- Google Analytics + Tag Manager

### Phase 5 — Security & Launch Prep (Week 10)
- Full input validation audit
- GDPR cookie compliance
- HTML injection hardening
- External security scan (Pentest Tools / Sucuri)
- Performance + SEO audit
- Go-live

---

## 8. Notes & Decisions

- The admin area must be **completely hidden** from public navigation — no links, no indexing (`robots.txt` disallow)
- Car reg numbers must be sanitised (strip spaces + special characters) **before** any DB check or API call
- Lookup source must always be logged: `api` | `db` | `cache`
- Existing database data must be **preserved and migrated**, not replaced
- eBay listings must reference the existing product data — no duplication
- Design must be inspired by turboactive.com but **must not be copied**

---
