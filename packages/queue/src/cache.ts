import Redis from "ioredis";

let redisClient: Redis | null = null;

function getRedis(): Redis {
  if (!redisClient) {
    if (!process.env.REDIS_URL) {
      throw new Error("REDIS_URL is not defined");
    }
    redisClient = new Redis(process.env.REDIS_URL, {
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
    });
  }
  return redisClient;
}

const CACHE_TTL = 60 * 60 * 24 * 7; // 7 days

export interface CacheKeyOptions {
  pullNumber?: number | string;
  commitSha?: string;
}

export function getCacheKey(
  owner: string,
  repo: string,
  type: string,
  options?: CacheKeyOptions | string,
): string {
  const baseKey = `analysis:${owner.toLowerCase()}:${repo.toLowerCase()}:${type.toUpperCase()}`;

  if (!options) {
    return baseKey;
  }

  if (typeof options === "string") {
    return `${baseKey}:${options}`;
  }

  const parts = [baseKey];

  if (options.pullNumber !== undefined && options.pullNumber !== null) {
    parts.push(`pr-${options.pullNumber}`);
  }

  if (options.commitSha) {
    parts.push(options.commitSha);
  }

  return parts.join(":");
}

export async function getCache<T>(
  owner: string,
  repo: string,
  type: string,
  options?: CacheKeyOptions | string,
): Promise<T | null> {
  const key = getCacheKey(owner, repo, type, options);
  const redis = getRedis();

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
  options?: CacheKeyOptions | string,
): Promise<void> {
  const key = getCacheKey(owner, repo, type, options);
  const redis = getRedis();

  await redis.set(key, JSON.stringify(value), "EX", CACHE_TTL);

  console.log(`[Cache] SAVED ${key}`);
}

export async function deleteCache(
  owner: string,
  repo: string,
  type: string,
  options?: CacheKeyOptions | string,
): Promise<void> {
  const key = getCacheKey(owner, repo, type, options);
  const redis = getRedis();

  await redis.del(key);

  console.log(`[Cache] DELETED ${key}`);
}
