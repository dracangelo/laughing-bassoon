import { createLookupRecord } from "@/lib/data-access";

export async function logLookup(registration: string, source: "api" | "db" | "cache", userIp?: string, vehicle?: Record<string, unknown>) {
  return createLookupRecord({ registration, source, userIp, vehicle });
}
