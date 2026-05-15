import { z } from "zod";
import { sanitizeText, slugify } from "@/lib/sanitize";
import { sanitizePartNumber } from "@/lib/sanitize-strings";

export const turboSchema = z.object({
  sku: z.string().transform(sanitizePartNumber).pipe(z.string().min(3).max(32)),
  make: z.string().transform((value) => sanitizeText(value, 48)).pipe(z.string().min(1)),
  model: z.string().transform((value) => sanitizeText(value, 48)).pipe(z.string().min(1)),
  year: z.coerce.number().int().min(1950).max(2100).optional(),
  engine: z.string().transform((value) => sanitizeText(value, 64)).pipe(z.string().min(1)),
  bhp: z.coerce.number().int().min(1).max(3000).optional(),
  type: z.string().transform((value) => sanitizeText(value, 32)).pipe(z.string().min(1)),
  price: z.coerce.number().min(0),
  stock: z.coerce.number().int().min(0).default(0),
  seoSlug: z.string().optional().transform((value, ctx) => {
    if (value) return slugify(value);
    const parent = ctx.path.join("-");
    return slugify(parent || "turbo");
  })
});

export const turboSearchSchema = z.object({
  make: z.string().optional(),
  model: z.string().optional(),
  year: z.coerce.number().int().optional(),
  engine: z.string().optional(),
  bhp: z.coerce.number().int().optional(),
  partNumber: z.string().optional().transform((value) => value ? sanitizePartNumber(value) : undefined)
});
