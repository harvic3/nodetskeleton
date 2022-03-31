import { IEventConnection } from "../IEventConnection";
import { ChannelNameEnum } from "../ChannelName.enum";

export type SubscribedChannel = { channel: ChannelNameEnum; subscribed: boolean };

export interface IEventSubscriber extends IEventConnection {
  subscribedChannels: SubscribedChannel[];
  subscribe(channel: ChannelNameEnum): Promise<boolean>;
  unsubscribe(channel: ChannelNameEnum): Promise<boolean>;
}
