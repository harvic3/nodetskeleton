import { IEventPublisher } from "../../../../application/shared/messaging/bus/IEventPublisher";
import { EventMessage } from "../../../../application/shared/messaging/EventMessage";
import { Publisher } from "../../../../infrastructure/messaging/MessageBus";
import { BooleanUtil } from "../../../../domain/shared/utils/BooleanUtil";

export class EventPublisher implements IEventPublisher {
  #publisher: Publisher | undefined;

  constructor(private readonly serviceName: string) {}

  async publish<T>(message: EventMessage<T>): Promise<boolean> {
    if (!this.online()) return Promise.resolve(false);

    return Promise.resolve(this.#publisher?.publish(message.channel, message.toJSON()))
      .then(() => true)
      .catch((error) => {
        console.error(
          `Error in ${this.serviceName} service publisher ${new Date().toISOString()}:`,
          error,
        );
        return false;
      });
  }

  online(): boolean {
    return this.#publisher?.connected || false;
  }

  initialize(client: Publisher): void {
    if (!client) return;

    this.#publisher = client;
    console.log(
      `${this.serviceName} publisher service initialized at ${new Date().toISOString()}.`,
    );

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
