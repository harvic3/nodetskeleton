import { BooleanUtil } from "../../../domain/shared/utils/BooleanUtil";
import { ClientModeEnum } from "../../messaging/ClientMode.enum";
import { RedisClient, createClient } from "redis";

export { RedisClient as Listener, RedisClient as Subscriber, RedisClient as Publisher };

export type RedisConnectionOptions = {
  host?: string;
  port?: number;
  path?: string;
  dbIndex: number;
  password?: string;
};

export abstract class RedisConnection {
  initialized = BooleanUtil.NOT;
  connected = BooleanUtil.NOT;
  subscriberListener: RedisClient | undefined;
  publisher: RedisClient | undefined;

  constructor(
    public readonly serviceName: string,
    private readonly connectionOptions: RedisConnectionOptions,
  ) {}

  close(): void {
    if (this.subscriberListener && this.subscriberListener?.connected)
      this.subscriberListener?.quit();

    if (this.publisher && this.publisher?.connected) this.publisher?.quit();
  }

  initialize(clientMode: ClientModeEnum = ClientModeEnum.PUB_SUB_MODE): void {
    if (this.initialized) return;

    try {
      if (clientMode === ClientModeEnum.PUB_SUB_MODE) {
        this.subscriberListener = createClient(this.connectionOptions);
        this.publisher = createClient(this.connectionOptions);
      } else {
        this.publisher = createClient(this.connectionOptions);
      }

      this.initialized = BooleanUtil.YES;
    } catch (error) {
      console.error(
        `Redis ${this.serviceName} client initialization error: ${JSON.stringify(error)}`,
      );
    }
  }
}
