import { ChannelNameEnum } from "./ChannelName.enum";
import { TopicNameEnum } from "./TopicName.enum";

export class EventMessage<T> {
  constructor(
    public readonly channel: ChannelNameEnum,
    public readonly topicName: TopicNameEnum,
    public data?: T,
  ) {}

  toJSON(): string {
    const message: {
      channel: ChannelNameEnum;
      topicName: TopicNameEnum;
      data?: T;
    } = { channel: this.channel, topicName: this.topicName, data: undefined };
    if (this.data) message.data = this.data;
    return JSON.stringify(message);
  }

  static fromJSON<T>(json: string): EventMessage<T> | null {
    if (!json) return null;

    const message: EventMessage<T> = JSON.parse(json);
    return new EventMessage(message.channel, message.topicName, message.data);
  }
}
