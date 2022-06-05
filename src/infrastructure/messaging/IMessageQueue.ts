import { IRedisConnection, Publisher } from "../dataBases/redis/IRedisConnection";

export interface IMessageQueue extends IRedisConnection {
  getQueuePublisher(): Publisher | undefined;
  disconnect(): void;
}
