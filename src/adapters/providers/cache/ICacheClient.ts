import { Publisher } from "../../../infrastructure/dataBases/redis/RedisConnection";

export interface ICacheClient {
  serviceName: string;
  getCacheClient(): Publisher | undefined;
  disconnect(): void;
}
