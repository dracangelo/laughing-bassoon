import { nextId, updateAppData } from "@/lib/persistence";

export async function logLookup(registration: string, source: "api" | "db" | "cache", userIp?: string, vehicle?: Record<string, unknown>) {
  return updateAppData((data) => {
    const lookup = {
      id: nextId(data.lookups),
      registration,
      source,
      userIp,
      vehicle,
      createdAt: new Date().toISOString()
    };
    data.lookups.push(lookup);
    return lookup;
  });
}
