import { ChannelNameEnum } from "../../../../application/shared/messaging/ChannelName.enum";
import { IEventQueue } from "../../../../application/shared/messaging/queue/IEventQueue";
import { TopicNameEnum } from "../../../../application/shared/messaging/TopicName.enum";

export type QueueArgs = {
  queueName: ChannelNameEnum;
  topicName: TopicNameEnum;
};

export interface IMessageQueueHandler {
  setEventQueue(eventQueue: IEventQueue): void;
  setUseCasesContext(useCasesContext: Record<string, string>): void;
  handle(args: QueueArgs): Promise<void>;
}
