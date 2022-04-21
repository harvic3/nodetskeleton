import { BooleanUtil } from "../../../domain/shared/utils/BooleanUtil";
import { ClientModeEnum } from "../../messaging/ClientMode.enum";
import { RedisClient, createClient } from "redis";

export { RedisClient as Listener, RedisClient as Subscriber, RedisClient as Publisher };

export type RedisConnectionOptions = {
  host?: string;
  port?: number;
  path?: string;
  dbIndex: number;
  password?: string | undefined;
};

export abstract class RedisConnection {
  initialized = BooleanUtil.NOT;
  connected = BooleanUtil.NOT;
  subscriberListenerClient: RedisClient | undefined;
  publisher: RedisClient | undefined;

  constructor(
    private readonly serviceName: string,
    private readonly connectionOptions: RedisConnectionOptions,
  ) {}

  close(): void {
    if (this.subscriberListenerClient && this.subscriberListenerClient?.connected)
      this.subscriberListenerClient?.quit();

    if (this.publisher && this.publisher?.connected) this.publisher?.quit();
  }

  initialize(clientType: ClientModeEnum = ClientModeEnum.PUB_SUB_MODE): void {
    if (this.initialized) return;

    try {
      if (clientType === ClientModeEnum.PUB_SUB_MODE) {
        this.subscriberListenerClient = createClient(this.connectionOptions);
        this.publisher = createClient(this.connectionOptions);
      }
      if (clientType === ClientModeEnum.PUB_MODE)
        this.publisher = createClient(this.connectionOptions);

      this.initialized = BooleanUtil.YES;
    } catch (error) {
      console.error(`Redis ${this.serviceName} client initialization error: ${error}`);
    }
  }
}
