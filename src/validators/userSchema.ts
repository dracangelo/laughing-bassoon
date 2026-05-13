import { z } from "zod";

export const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(12).max(128),
  role: z.enum(["customer", "b2b", "admin"]).default("customer")
});
