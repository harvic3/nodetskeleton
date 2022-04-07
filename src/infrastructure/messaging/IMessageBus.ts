import { IEventSubscriber } from "../../application/shared/messaging/bus/IEventSubscriber";
import { IEventPublisher } from "../../application/shared/messaging/bus/IEventPublisher";
import { IEventListener } from "../../application/shared/messaging/bus/IEventListener";
import { IRedisConnection } from "../dataBases/redis/IRedisConnection";

export interface IMessageBus extends IRedisConnection {
  getListener(): IEventListener | undefined;
  getSubscriber(): IEventSubscriber | undefined;
  getPublisher(): IEventPublisher | undefined;
  disconnect(): void;
}
