import { createClient } from 'redis';

const redisClient = createClient();

await redisClient.connect();

export const getCache = async (key) => {
  const data = await redisClient.get(key);
  return data ? JSON.parse(data) : null;
};

export const setCache = async (key, value, ttl = 60) => {
  await redisClient.setEx(key, ttl, JSON.stringify(value));
};

export const delCache = async (pattern) => {
  const keys = await redisClient.keys(pattern);
  if (keys.length > 0) {
    await redisClient.del(keys);
  }
};

export default redisClient;