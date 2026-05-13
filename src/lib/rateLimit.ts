import { getRedis } from "@/lib/redis";

const localBuckets = new Map<string, { count: number; resetAt: number }>();

export async function rateLimit(key: string, limit: number, windowMs: number) {
  const redis = getRedis();

  if (redis) {
    const current = await redis.incr(key);
    if (current === 1) await redis.pexpire(key, windowMs);
    return {
      allowed: current <= limit,
      remaining: Math.max(limit - current, 0)
    };
  }

  const now = Date.now();
  const bucket = localBuckets.get(key);
  if (!bucket || bucket.resetAt < now) {
    localBuckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1 };
  }

  bucket.count += 1;
  return { allowed: bucket.count <= limit, remaining: Math.max(limit - bucket.count, 0) };
}
