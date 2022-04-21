import { IEventListener } from "../../../../application/shared/messaging/bus/IEventListener";
import { ChannelNameEnum } from "../../../../application/shared/messaging/ChannelName.enum";
import { Listener } from "../../../../infrastructure/messaging/MessageBus";
import { BooleanUtil } from "../../../../domain/shared/utils/BooleanUtil";
import messageBusHandler from "../../handlers/bus/MessageBus.handler";

export class EventListener implements IEventListener {
  private listener: Listener | undefined;

  constructor(private readonly serviceName: string) {}

  listen(): void {
    this.listener?.on("message", (channel: string, message: string) => {
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
    return this.listener?.connected || BooleanUtil.NOT;
  }

  initialize(client: Listener): void {
    if (!client) return;

    this.listener = client;
    console.log(`${this.serviceName} listener service initialized at ${new Date().toISOString()}.`);

    this.listener?.on("connect", () => {
      console.log(`Listener ${this.serviceName} CONNECTED`);
    });

    this.listener?.on("error", (error) => {
      console.error(
        `Listener ${this.serviceName} service error ${new Date().toISOString()}:`,
        error,
      );
    });
  }
}
