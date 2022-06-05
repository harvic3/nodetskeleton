import {
  Listener,
  Publisher,
  RedisConnection,
  RedisConnectionOptions,
  Subscriber,
} from "../dataBases/redis/RedisConnection";
import { IMessageBus } from "./IMessageBus";

export { Listener, Publisher, Subscriber } from "../dataBases/redis/RedisConnection";

export class MessageBus extends RedisConnection implements IMessageBus {
  constructor(serviceName: string, redisConnectionOptions: RedisConnectionOptions) {
    super(serviceName, redisConnectionOptions);
  }

  getListener(): Listener | undefined {
    return this.initialized ? this.subscriberListener : undefined;
  }

  getSubscriber(): Subscriber | undefined {
    return this.initialized ? this.subscriberListener : undefined;
  }

  getPublisher(): Publisher | undefined {
    return this.initialized ? this.publisher : undefined;
  }

  disconnect(): void {
    this.close();
  }
}
