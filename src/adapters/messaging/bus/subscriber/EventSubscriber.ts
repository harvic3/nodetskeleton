import { ChannelNameEnum } from "../../../../application/shared/messaging/ChannelName.enum";
import { Subscriber } from "../../../../infrastructure/messaging/MessageBus";
import { NumberUtil } from "../../../../domain/shared/utils/NumberUtil";
import {
  IEventSubscriber,
  SubscribedChannel,
} from "../../../../application/shared/messaging/bus/IEventSubscriber";
import ArrayUtil from "../../../../domain/shared/utils/ArrayUtil";

export class EventSubscriber implements IEventSubscriber {
  #subscriber: Subscriber | undefined;
  subscribedChannels: SubscribedChannel[] = [];

  constructor(private readonly serviceName: string) {}

  async subscribe(channel: ChannelNameEnum): Promise<boolean> {
    this.addChannel(channel);

    if (!this.online()) return Promise.resolve(false);

    return Promise.resolve(this.#subscriber?.subscribe(channel))
      .then(() => {
        console.log(
          `${this.serviceName} subscribed to ${channel} channel at ${new Date().toISOString()}.`,
        );
        this.setSubscribed(channel);
        return true;
      })
      .catch((error) => {
        console.error(`${this.serviceName} subscribe error: `, error);
        return false;
      });
  }

  async unsubscribe(channel: ChannelNameEnum): Promise<boolean> {
    if (!this.online()) return Promise.resolve(false);

    return Promise.resolve(this.#subscriber?.unsubscribe(channel))
      .then(() => {
        console.log(
          `${this.serviceName} unsubscribed to ${channel} channel at ${new Date().toISOString()}.`,
        );
        this.removeChannel(channel);
        return true;
      })
      .catch((error) => {
        console.error(`${this.serviceName} unsubscribe error: `, error);
        return false;
      });
  }

  online(): boolean {
    return this.#subscriber?.connected || false;
  }

  initialize(client: Subscriber): void {
    if (!client) return;

    this.#subscriber = client;

    this.#subscriber?.on("connect", () => {
      console.log(`Subscriber ${this.serviceName} CONNECTED`);
      this.initializeSubscriptions();
    });

    this.#subscriber?.on("error", (error: any) => {
      console.error(
        `Subscriber ${this.serviceName} service error ${new Date().toISOString()}:`,
        error,
      );
    });
  }

  private addChannel(channel: ChannelNameEnum): void {
    const exists = this.subscribedChannels.some((subscription) => subscription.channel === channel);
    if (exists) return;

    this.subscribedChannels.push({ channel, subscribed: false });
  }

  private removeChannel(channel: ChannelNameEnum): void {
    const exists = this.subscribedChannels.find((subscription) => subscription.channel === channel);
    if (!exists) return;

    const index = this.subscribedChannels.indexOf(exists);
    if (!ArrayUtil.isValidIndex(index)) return;

    this.subscribedChannels.splice(index, NumberUtil.ONE);
  }

  private setSubscribed(channel: ChannelNameEnum): void {
    const subscription = this.subscribedChannels.find(
      (_subscription) => _subscription.channel === channel,
    );
    if (!subscription) return;

    subscription.subscribed = true;
  }

  private initializeSubscriptions(): void {
    this.subscribedChannels.forEach((subscription) => {
      if (subscription.subscribed) {
        console.log(
          `Subscribed to ${subscription.channel} channel in ${
            this.serviceName
          } service at ${new Date().toISOString()}.`,
        );
        return;
      }
      this.subscribe(subscription.channel);
    });
  }
}
