import { Publisher, RedisConnection } from "../dataBases/redis/RedisConnection";
import { RedisConnectionOptions } from "../dataBases/redis/IRedisConnection";
import { ICacheClient } from "../../adapters/providers/cache/ICacheClient";
import { ClientModeEnum } from "../messaging/ClientMode.enum";

export class CacheClient extends RedisConnection implements ICacheClient {
  constructor(serviceName: string, redisConnectionOptions: RedisConnectionOptions) {
    super(serviceName, redisConnectionOptions);
    this.initialize(ClientModeEnum.PUB_MODE);
  }

  getCacheClient(): Publisher | undefined {
    return this.initialized ? this.publisher : undefined;
  }

  disconnect(): void {
    this.close();
  }
}
