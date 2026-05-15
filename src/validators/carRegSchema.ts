import { z } from "zod";
import { sanitizeRegistration } from "@/lib/sanitize-strings";

export const carRegSchema = z.object({
  registration: z.string().transform(sanitizeRegistration).pipe(z.string().min(2).max(12).regex(/^[A-Z0-9]+$/))
});
