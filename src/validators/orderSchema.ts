import { z } from "zod";

export const orderSchema = z.object({
  items: z.array(z.object({
    turboId: z.coerce.number().int().positive(),
    quantity: z.coerce.number().int().positive().max(20)
  })).min(1),
  email: z.string().email(),
  address: z.string().min(8).max(240)
});
