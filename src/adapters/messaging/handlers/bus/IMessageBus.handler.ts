import { ChannelNameEnum } from "../../../../application/shared/messaging/ChannelName.enum";

export type Args = {
  channel: ChannelNameEnum;
  message: string;
};

export interface IMessageBusHandler {
  handle(args: Args): Promise<void>;
}
