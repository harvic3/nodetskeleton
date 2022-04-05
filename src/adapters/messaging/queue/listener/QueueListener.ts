import { ChannelNameEnum } from "../../../../application/shared/messaging/ChannelName.enum";
import { IEventQueue } from "../../../../application/shared/messaging/queue/IEventQueue";
import { TopicNameEnum } from "../../../../application/shared/messaging/TopicName.enum";
import { MessageQueueHandler } from "../../handlers/queue/MessageQueue.handler";
import AppSettings from "../../../../application/shared/settings/AppSettings";
import { ServiceContext } from "../../../controllers/base/Base.controller";
import { QueueArgs } from "../../handlers/queue/IMessageQueue.handler";
import {
  ManageLastLoginEventUseCase,
  ManageUserCreatedEventUseCase,
} from "../../handlers/queue/container";
import { EventEmitter } from "events";

export class QueueListener {
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
    console.log(`${this.serviceName} is listening`);
    this.setUseCaseContext();
  }

  private setUseCaseContext(): void {
    const useCasesContext: Record<string, string> = {};

    if (AppSettings.ServiceContext === ServiceContext.NODE_TS_SKELETON) {
      useCasesContext[`${ChannelNameEnum.QUEUE_USERS}:${TopicNameEnum.ADDED}`] =
        ManageUserCreatedEventUseCase.name;
      useCasesContext[`${ChannelNameEnum.QUEUE_SECURITY}:${TopicNameEnum.LOGGED}`] =
        ManageLastLoginEventUseCase.name;
    }

    if (AppSettings.ServiceContext === ServiceContext.USERS) {
      useCasesContext[`${ChannelNameEnum.QUEUE_USERS}:${TopicNameEnum.ADDED}`] =
        ManageUserCreatedEventUseCase.name;
    }

    if (AppSettings.ServiceContext === ServiceContext.SECURITY) {
      useCasesContext[`${ChannelNameEnum.QUEUE_SECURITY}:${TopicNameEnum.LOGGED}`] =
        ManageLastLoginEventUseCase.name;
    }

    this.messageQueueHandler.setUseCasesContext(useCasesContext);
  }
}
