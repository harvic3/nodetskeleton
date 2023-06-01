import { IEventListener } from "../../../../application/shared/messaging/bus/IEventListener";
import { ChannelNameEnum } from "../../../../application/shared/messaging/ChannelName.enum";
import { Listener } from "../../../../infrastructure/messaging/MessageBus";
import messageBusHandler from "../../handlers/bus/MessageBus.handler";

export class EventListener implements IEventListener {
  #listener: Listener | undefined;

  constructor(private readonly serviceName: string) {}

  listen(): void {
    if (!this.#listener) return;

    this.#listener?.on("message", (channel: string, message: string) => {
      Promise.resolve(
        messageBusHandler.handle({ channel: channel as ChannelNameEnum, message }),
      ).catch((error) => {
        console.error(
          `Error in ${this.serviceName} service listener ${new Date().toISOString()}:`,
          error,
        );
      });
    });
  }

  online(): boolean {
    return this.#listener?.connected || false;
  }

  initialize(client: Listener): void {
    if (!client) return;

    this.#listener = client;
    console.log(`${this.serviceName} listener service initialized at ${new Date().toISOString()}.`);

    this.#listener?.on("connect", () => {
      console.log(`Listener ${this.serviceName} CONNECTED`);
    });

    this.#listener?.on("error", (error: any) => {
      console.error(
        `Listener ${this.serviceName} service error ${new Date().toISOString()}:`,
        error,
      );
    });
  }
}
