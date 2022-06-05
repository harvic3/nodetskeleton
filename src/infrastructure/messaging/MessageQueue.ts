import { IMessageQueue } from "./IMessageQueue";
import {
  Publisher,
  RedisConnection,
  RedisConnectionOptions,
} from "../dataBases/redis/RedisConnection";

export class MessageQueue extends RedisConnection implements IMessageQueue {
  constructor(serviceName: string, redisConnectionOptions: RedisConnectionOptions) {
    super(serviceName, redisConnectionOptions);
  }

  getQueuePublisher(): Publisher | undefined {
    return this.initialized ? this.publisher : undefined;
  }

  disconnect(): void {
    this.close();
  }
}
