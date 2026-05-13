import { slugify } from "@/lib/sanitize";

export function turboSeoUrl(parts: { make: string; model: string; engine: string; sku: string }) {
  return `/turbos/${slugify(`${parts.make} ${parts.model} ${parts.engine} ${parts.sku}`)}`;
}

export function campaignUrl(path: string, campaign = "organic") {
  return `${path}?utm_source=google&utm_medium=cpc&utm_campaign=${slugify(campaign)}`;
}
