import { ClientModeEnum } from "../../messaging/ClientMode.enum";
import { RedisClient } from "redis";

export { RedisClient as Listener, RedisClient as Subscriber, RedisClient as Publisher };

export type RedisConnectionOptions = {
  host?: string;
  port?: number;
  path?: string;
  dbIndex: number;
  password?: string | undefined;
};

export interface IRedisConnection {
  initialized: boolean;
  connected: boolean;
  subscriberListener: RedisClient | undefined;
  publisher: RedisClient | undefined;

  close(): void;
  initialize(clientType: ClientModeEnum): void;
}
