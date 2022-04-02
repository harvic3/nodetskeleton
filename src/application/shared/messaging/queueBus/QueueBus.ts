import { ILogProvider } from "../../../../application/shared/log/providerContracts/ILogProvider";
import { IEventPublisher } from "../../../../application/shared/messaging/bus/IEventPublisher";
import { ChannelNameEnum } from "../../../../application/shared/messaging/ChannelName.enum";
import { IEventQueue } from "../../../../application/shared/messaging/queue/IEventQueue";
import { TopicNameEnum } from "../../../../application/shared/messaging/TopicName.enum";
import { EventMessage } from "../../../../application/shared/messaging/EventMessage";
import { ErrorLog } from "../../../../application/shared/log/ErrorLog";
import { IQueueBus } from "./IQueueBus";

export class QueueBus implements IQueueBus {
  constructor(
    private readonly logProvider: ILogProvider,
    private readonly eventPublisher: IEventPublisher,
    private readonly eventQueue: IEventQueue,
  ) {}

  async pushPub<T>(channel: ChannelNameEnum, topicName: TopicNameEnum, message: T): Promise<void> {
    const queueMessage = new EventMessage<T>(channel, topicName, message);
    return this.eventQueue
      .push(queueMessage)
      .then(() => {
        const busMessage = new EventMessage<T>(channel, topicName);
        this.eventPublisher.publish<T>(busMessage).catch((error) => {
          this.logProvider.logError(
            new ErrorLog({
              context: QueueBus.name,
              name: "EventQueueError",
              message: error.message,
              stack: error,
            }),
          );
        });
      })
      .catch((error) => {
        this.logProvider.logError(
          new ErrorLog({
            context: QueueBus.name,
            name: "EventBusError",
            message: error.message,
            stack: error,
          }),
        );
      });
  }
}
