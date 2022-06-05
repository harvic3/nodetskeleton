import {
  Publisher,
  RedisConnection,
  RedisConnectionOptions,
} from "../dataBases/redis/RedisConnection";
import { IMessageQueue } from "./IMessageQueue";

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
