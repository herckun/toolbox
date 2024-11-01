import { redisManager } from "../cache/redis";

export const cacheResult = async (
  key: string,
  ttl: number,
  callback: () => any
) => {
  try {
    const data = await redisManager.get(key);
    if (data) {
      return JSON.parse(data);
    }
  } catch (err) {
    console.error("Redis failed, fetching data directly", err);
  }

  const result = await callback();
  try {
    await redisManager.set(
      key,
      JSON.stringify({
        ...result,
        cached: true,
        expiresAt: new Date().getTime() + ttl * 1000,
      }),
      ttl
    );
  } catch (err) {
    console.error("Failed to cache result in Redis", err);
  }

  return result;
};

export const invalidateCache = async (key: string) => {
  try {
    await redisManager.del(key);
  } catch (err) {
    console.error("Failed to invalidate cache in Redis", err);
  }
};

export const invalidateAll = async () => {
  try {
    await redisManager.flushall();
  } catch (err) {
    console.error("Failed to invalidate all cache in Redis", err);
  }
};
