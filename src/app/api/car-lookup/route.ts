import { NextResponse } from "next/server";
import { carRegSchema } from "@/validators/carRegSchema";
import { fetchVehicleFromDvla } from "@/lib/dvla";
import { getRedis } from "@/lib/redis";
import { logLookup } from "@/lib/lookup";
import { jsonError } from "@/lib/http";
import { rateLimit } from "@/lib/rateLimit";

const inMemoryVehicleCache = new Map<string, unknown>();

export async function POST(request: Request) {
  const limiter = await rateLimit("lookup:reg", 25, 60_000);
  if (!limiter.allowed) return jsonError("Too many registration lookups. Please try again shortly.", 429);

  const parsed = carRegSchema.safeParse(await request.json());
  if (!parsed.success) return jsonError("Invalid registration");

  const { registration } = parsed.data;
  const redis = getRedis();
  const cacheKey = `vehicle:${registration}`;
  const userIp = request.headers.get("x-forwarded-for") || "127.0.0.1";
  const cached = await redis?.get(cacheKey);

  if (cached) {
    const vehicle = JSON.parse(cached) as Record<string, unknown>;
    await logLookup(registration, "cache", userIp, vehicle);
    return NextResponse.json({ registration, source: "cache", vehicle });
  }

  if (inMemoryVehicleCache.has(registration)) {
    const vehicle = inMemoryVehicleCache.get(registration) as Record<string, unknown>;
    await logLookup(registration, "db", userIp, vehicle);
    return NextResponse.json({ registration, source: "db", vehicle });
  }

  const vehicle = await fetchVehicleFromDvla(registration);
  inMemoryVehicleCache.set(registration, vehicle);
  await redis?.set(cacheKey, JSON.stringify(vehicle), "EX", 60 * 60 * 24);
  await logLookup(registration, "api", userIp, vehicle as Record<string, unknown>);

  return NextResponse.json({
    registration,
    source: "api",
    vehicle,
    message: `${registration} cleaned, checked locally, then retrieved from vehicle API.`
  });
}
