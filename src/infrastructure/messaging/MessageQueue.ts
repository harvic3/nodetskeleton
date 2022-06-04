import { RedisConnection, RedisConnectionOptions } from "../dataBases/redis/RedisConnection";
import { IEventQueue } from "../../application/shared/messaging/queue/IEventQueue";
import { TypeParser } from "../../domain/shared/utils/TypeParser";
import { IMessageQueue } from "./IMessageQueue";

export class MessageQueue extends RedisConnection implements IMessageQueue {
  constructor(serviceName: string, redisConnectionOptions: RedisConnectionOptions) {
    super(serviceName, redisConnectionOptions);
  }

  getQueuePublisher(): IEventQueue | undefined {
    return this.initialized ? TypeParser.cast<IEventQueue>(this.publisher) : undefined;
  }

  disconnect(): void {
    this.close();
  }
}
