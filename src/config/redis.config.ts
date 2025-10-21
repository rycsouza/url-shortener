import { redisStore } from 'cache-manager-ioredis-yet';

const redisConfig = async () => {
  return await redisStore({
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
    ttl: 24 * 60 * 60,
  });
};

export default redisConfig;
