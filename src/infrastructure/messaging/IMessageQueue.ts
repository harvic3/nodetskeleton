import { IEventQueue } from "../../application/shared/messaging/queue/IEventQueue";
import { IRedisConnection } from "../dataBases/redis/IRedisConnection";

export interface IMessageQueue extends IRedisConnection {
  getQueuePublisher(): IEventQueue | undefined;
  disconnect(): void;
}
