import { ChannelNameEnum } from "../ChannelName.enum";
import { IEventConnection } from "../IEventConnection";
import { EventMessage } from "../EventMessage";

export interface IEventQueue extends IEventConnection {
  push<T>(message: EventMessage<T>): Promise<boolean>;
  pop<T>(queueName: ChannelNameEnum): Promise<EventMessage<T> | null>;
}
