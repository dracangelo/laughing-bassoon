import { NextResponse } from "next/server";
import { carRegSchema } from "@/validators/carRegSchema";
import { fetchVehicleFromDvla } from "@/lib/dvla";
import { getRedis } from "@/lib/redis";

const inMemoryVehicleCache = new Map<string, unknown>();

export async function POST(request: Request) {
  const parsed = carRegSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid registration" }, { status: 400 });
  }

  const { registration } = parsed.data;
  const redis = getRedis();
  const cacheKey = `vehicle:${registration}`;
  const cached = await redis?.get(cacheKey);

  if (cached) {
    return NextResponse.json({ registration, source: "cache", vehicle: JSON.parse(cached) });
  }

  if (inMemoryVehicleCache.has(registration)) {
    return NextResponse.json({ registration, source: "db", vehicle: inMemoryVehicleCache.get(registration) });
  }

  const vehicle = await fetchVehicleFromDvla(registration);
  inMemoryVehicleCache.set(registration, vehicle);
  await redis?.set(cacheKey, JSON.stringify(vehicle), "EX", 60 * 60 * 24);

  return NextResponse.json({
    registration,
    source: "api",
    vehicle,
    message: `${registration} cleaned, checked locally, then retrieved from vehicle API.`
  });
}
