import { ChannelNameEnum } from "../../../../application/shared/messaging/ChannelName.enum";
import { IEventQueue } from "../../../../application/shared/messaging/queue/IEventQueue";
import { TopicNameEnum } from "../../../../application/shared/messaging/TopicName.enum";
import { MessageQueueHandler } from "../../handlers/queue/MessageQueue.handler";
import AppSettings from "../../../../application/shared/settings/AppSettings";
import { ServiceContext } from "../../../controllers/base/Base.controller";
import { QueueArgs } from "../../handlers/queue/IMessageQueue.handler";
import { IQueueListener } from "./IQueueListener";
import {
  ManageLastLoginEventUseCase,
  ManageUserCreatedEventUseCase,
} from "../../handlers/queue/container";
import { EventEmitter } from "events";

export class QueueListener implements IQueueListener {
  constructor(
    private readonly serviceName: string,
    private readonly messageQueueHandler: MessageQueueHandler,
    private readonly emitter: EventEmitter,
    readonly eventQueue: IEventQueue,
  ) {
    this.messageQueueHandler.setEventQueue(eventQueue);
  }

  readQueue(args: QueueArgs): void {
    this.messageQueueHandler.handle(args);
  }

  listen(): void {
    this.emitter.on(this.serviceName, this.readQueue.bind(this));
    console.log(`${this.serviceName} emitter is listening`);
    this.setUseCaseContext();
  }

  private setUseCaseContext(): void {
    const useCasesContext: Record<string, string> = {};

    switch (AppSettings.ServiceContext) {
      case ServiceContext.SECURITY:
        useCasesContext[`${ChannelNameEnum.QUEUE_USERS}:${TopicNameEnum.ADDED}`] =
          ManageUserCreatedEventUseCase.name;
        break;
      case ServiceContext.USERS:
        useCasesContext[`${ChannelNameEnum.QUEUE_SECURITY}:${TopicNameEnum.LOGGED}`] =
          ManageLastLoginEventUseCase.name;
        break;
      default:
        useCasesContext[`${ChannelNameEnum.QUEUE_USERS}:${TopicNameEnum.ADDED}`] =
          ManageUserCreatedEventUseCase.name;
        useCasesContext[`${ChannelNameEnum.QUEUE_SECURITY}:${TopicNameEnum.LOGGED}`] =
          ManageLastLoginEventUseCase.name;
        break;
    }

    this.messageQueueHandler.setUseCasesContext(useCasesContext);
  }
}
