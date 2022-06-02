import { ChannelNameEnum } from "../../../../application/shared/messaging/ChannelName.enum";
import { IEventQueue } from "../../../../application/shared/messaging/queue/IEventQueue";
import { EventMessage } from "../../../../application/shared/messaging/EventMessage";
import { Publisher } from "../../../../infrastructure/messaging/MessageBus";
import { BooleanUtil } from "../../../../domain/shared/utils/BooleanUtil";

export class EventQueue implements IEventQueue {
  #publisher: Publisher | undefined;

  constructor(private readonly serviceName: string) {}

  async push<T>(message: EventMessage<T>): Promise<boolean> {
    if (!this.online()) return Promise.resolve(BooleanUtil.NOT);

    return new Promise((resolve) => {
      this.#publisher?.rpush(message.channel, message.toJSON(), (error) => {
        if (error) {
          return resolve(BooleanUtil.NOT);
        }
        return resolve(BooleanUtil.YES);
      });
    });
  }

  async pop<T>(queueName: ChannelNameEnum): Promise<EventMessage<T> | null> {
    if (!this.online()) return Promise.resolve(null);

    return new Promise((resolve) => {
      this.#publisher?.lpop(queueName, (error, data) => {
        if (error) {
          return resolve(null);
        }
        return resolve(EventMessage.fromJSON<T>(data));
      });
    });
  }

  online(): boolean {
    return this.#publisher?.connected || BooleanUtil.NOT;
  }

  initialize(client: Publisher): void {
    if (!client) return;

    this.#publisher = client;

    this.#publisher?.on("connect", () => {
      console.log(`Publisher ${this.serviceName} CONNECTED`);
    });

    this.#publisher?.on("error", (error) => {
      console.error(
        `Publisher ${this.serviceName} service error ${new Date().toISOString()}:`,
        error,
      );
    });
  }
}
