import { QueueArgs } from "../../handlers/queue/IMessageQueue.handler";

export interface IQueueListener {
  readQueue(args: QueueArgs): void;
  listen(): void;
}
