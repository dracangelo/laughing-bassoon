import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    totalLookups: 1284,
    apiCalls: 312,
    dbHits: 654,
    cacheHits: 318
  });
}
