import { Redis } from "ioredis";
import type { ICacheProvider } from "../../lib/types/interfaces/cach.interface.js";

interface IRedisConfig {
  url: string;
}

export class RedisCacheProvider implements ICacheProvider {
  private client: Redis;
  constructor(redisConfig: IRedisConfig) {
    this.client = new Redis(redisConfig.url, {
      lazyConnect: true,
      maxLoadingRetryTime: 3,
    });
    this.client.on("error", (err) => {
      console.log(err.message);
    });
    this.client.connect().catch((err) => console.log(err.message));
  }

  async set(key: string, value: unknown, ttl?: number): Promise<"OK" | null> {
    const serializedValue  = JSON.stringify(value);
    if (!ttl) {
      return this.client.set(key, serializedValue);
    }

    return this.client.set(key, serializedValue, "EX", ttl);
  }

  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async del(key: string): Promise<number> {
    return this.client.del(key);
  }

  async ttl(key: string): Promise<number> {
    return this.client.ttl(key);
  }

  async exists(key: string): Promise<number> {
    return this.client.exists(key);
  }
}
