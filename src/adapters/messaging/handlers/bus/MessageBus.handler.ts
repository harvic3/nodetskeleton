import { TopicNameEnum } from "../../../../application/shared/messaging/TopicName.enum";
import { EventMessage } from "../../../../application/shared/messaging/EventMessage";
import { BaseUseCase } from "../../../../application/shared/useCase/BaseUseCase";
import AppSettings from "../../../../application/shared/settings/AppSettings";
import { TypeParser } from "../../../../domain/shared/utils/TypeParser";
import { Args, IMessageBusHandler } from "./IMessageBus.handler";
import { QueueClientEnum } from "../../queue/QueueClient.enum";
import { IServiceContainer } from "../../../shared/kernel";
import { IUser } from "../../../../domain/user/IUser";
import messageBusUseCasesContainer from "./container";
import { EventEmitter } from "events";
import { UseCaseTrace } from "../../../../application/shared/log/UseCaseTrace";

type MessageTypes = IUser;

export class MessageBusHandler implements IMessageBusHandler {
  constructor(private readonly messageBusUseCases: IServiceContainer) {}

  async handle(args: Args): Promise<void> {
    const message = EventMessage.fromJSON<MessageTypes>(args.message);

    try {
      String(args.channel).includes(AppSettings.QUEUE_BASE_NAME)
        ? this.messageBusUseCases
            .get<EventEmitter>(MessageBusHandler.name, QueueClientEnum.TSK_QUEUE_LISTENER_EMITTER)
            .emit(QueueClientEnum.TSK_QUEUE_LISTENER_EMITTER, {
              queueName: args.channel,
              topicName: message?.topicName as TopicNameEnum,
            })
        : this.messageBusUseCases
            .get<BaseUseCase<EventMessage<MessageTypes>>>(
              MessageBusHandler.name,
              `${args.channel}:${message?.topicName}`,
            )
            .execute(
              AppSettings.DefaultLanguage,
              {} as UseCaseTrace,
              TypeParser.cast<EventMessage<MessageTypes>>(message),
            );
    } catch (error) {
      console.error(
        `${
          MessageBusHandler.name
        } ${new Date().toISOString()} Error: ${error} Message: ${JSON.stringify(message)}`,
      );
    }

    return Promise.resolve();
  }
}

export default new MessageBusHandler(messageBusUseCasesContainer);
