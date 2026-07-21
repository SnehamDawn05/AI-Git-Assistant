import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL!);

const CACHE_TTL = 60 * 60 * 24 * 7; // 7 days

export function getCacheKey(owner: string, repo: string, type: string) {
  return `analysis:${owner}:${repo}:${type}`;
}

export async function getCache<T>(
  owner: string,
  repo: string,
  type: string,
): Promise<T | null> {
  const key = getCacheKey(owner, repo, type);

  const data = await redis.get(key);

  if (!data) {
    console.log(`[Cache] MISS ${key}`);
    return null;
  }

  console.log(`[Cache] HIT ${key}`);

  return JSON.parse(data) as T;
}

export async function setCache<T>(
  owner: string,
  repo: string,
  type: string,
  value: T,
): Promise<void> {
  const key = getCacheKey(owner, repo, type);

  await redis.set(key, JSON.stringify(value), "EX", CACHE_TTL);

  console.log(`[Cache] SAVED ${key}`);
}
