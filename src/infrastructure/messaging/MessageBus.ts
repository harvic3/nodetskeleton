import { RedisConnection, RedisConnectionOptions } from "../dataBases/redis/RedisConnection";
import { IEventSubscriber } from "../../application/shared/messaging/bus/IEventSubscriber";
import { IEventPublisher } from "../../application/shared/messaging/bus/IEventPublisher";
import { IEventListener } from "../../application/shared/messaging/bus/IEventListener";
import { TypeParser } from "../../domain/shared/utils/TypeParser";

export { Listener, Publisher, Subscriber } from "../dataBases/redis/RedisConnection";

export class MessageBus extends RedisConnection {
  constructor(serviceName: string, redisConnectionOptions: RedisConnectionOptions) {
    super(serviceName, redisConnectionOptions);
  }

  getListener(): IEventListener | undefined {
    return this.initialized ? TypeParser.cast<IEventListener>(this.subscriberListener) : undefined;
  }

  getSubscriber(): IEventSubscriber | undefined {
    return this.initialized
      ? TypeParser.cast<IEventSubscriber>(this.subscriberListener)
      : undefined;
  }

  getPublisher(): IEventPublisher | undefined {
    return this.initialized ? TypeParser.cast<IEventPublisher>(this.publisher) : undefined;
  }

  disconnect(): void {
    this.close();
  }
}
