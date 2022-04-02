import { ChannelNameEnum } from "../ChannelName.enum";
import { TopicNameEnum } from "../TopicName.enum";

export interface IQueueBus {
  pushPub<T>(channel: ChannelNameEnum, topicName: TopicNameEnum, message: T): Promise<void>;
}
