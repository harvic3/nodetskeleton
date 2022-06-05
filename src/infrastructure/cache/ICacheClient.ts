import { Publisher } from "../dataBases/redis/RedisConnection";

export interface ICacheClient {
  getCacheClient(): Publisher | undefined;
  disconnect(): void;
}
