import {
  IRedisConnection,
  Listener,
  Publisher,
  Subscriber,
} from "../dataBases/redis/IRedisConnection";

export interface IMessageBus extends IRedisConnection {
  getListener(): Listener | undefined;
  getSubscriber(): Subscriber | undefined;
  getPublisher(): Publisher | undefined;
  disconnect(): void;
}
