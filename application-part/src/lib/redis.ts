// lib/redis.ts
import { createClient } from 'redis';

let client: ReturnType<typeof createClient>;

if (!globalThis.redisClient) {
  client = createClient({
    username: 'default',
    password: process.env.REDIS_PASSWORD,
    socket: {
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT),
    },
  });

  client.on('error', (err) => console.log('Redis Client Error', err));

  client.connect();

  if (process.env.NODE_ENV === 'development') {
    globalThis.redisClient = client; // reuse on hot reload
  }
} else {
  client = globalThis.redisClient;
}

export default client;
