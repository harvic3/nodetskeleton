import { ChannelNameEnum } from "../../../../application/shared/messaging/ChannelName.enum";
import { IEventQueue } from "../../../../application/shared/messaging/queue/IEventQueue";
import { EventMessage } from "../../../../application/shared/messaging/EventMessage";
import { Publisher } from "../../../../infrastructure/messaging/MessageBus";

export class EventQueue implements IEventQueue {
  #publisher: Publisher | undefined;

  constructor(private readonly serviceName: string) {}

  async push<T>(message: EventMessage<T>): Promise<boolean> {
    if (!this.online()) return Promise.resolve(false);

    return new Promise((resolve) => {
      this.#publisher?.rpush(message.channel, message.toJSON(), (error: any) => {
        if (error) {
          return resolve(false);
        }
        return resolve(true);
      });
    });
  }

  async pop<T>(queueName: ChannelNameEnum): Promise<EventMessage<T> | null> {
    if (!this.online()) return Promise.resolve(null);

    return new Promise((resolve) => {
      this.#publisher?.lpop(queueName, (error: any, data: string) => {
        if (error) {
          return resolve(null);
        }
        return resolve(EventMessage.fromJSON<T>(data));
      });
    });
  }

  online(): boolean {
    return this.#publisher?.connected || false;
  }

  initialize(client: Publisher): void {
    if (!client) return;

    this.#publisher = client;

    this.#publisher?.on("connect", () => {
      console.log(`Publisher ${this.serviceName} CONNECTED`);
    });

    this.#publisher?.on("error", (error: any) => {
      console.error(
        `Publisher ${this.serviceName} service error ${new Date().toISOString()}:`,
        error,
      );
    });
  }
}
