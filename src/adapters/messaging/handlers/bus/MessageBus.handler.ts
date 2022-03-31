import { ChannelNameEnum } from "../../../../application/shared/messaging/ChannelName.enum";
import { TopicNameEnum } from "../../../../application/shared/messaging/TopicName.enum";
import { EventMessage } from "../../../../application/shared/messaging/EventMessage";
import { BaseUseCase } from "../../../../application/shared/useCase/BaseUseCase";
import AppSettings from "../../../../application/shared/settings/AppSettings";
import { TypeParser } from "../../../../domain/shared/utils/TypeParser";
import { Container } from "../../../../infrastructure/ioc/Container";
import { QueueClientEnum } from "../../queue/QueueClient.enum";
import { IUser } from "../../../../domain/user/IUser";
import messageBusUseCasesContainer from "./container";
import { EventEmitter } from "events";

type MessageTypes = IUser;

type Args = {
  channel: ChannelNameEnum;
  message: string;
};

export class MessageBusHandler {
  constructor(private readonly messageBusUseCases: Container) {}

  async handle(args: Args): Promise<void> {
    const message = EventMessage.fromJSON<MessageTypes>(args.message);

    try {
      String(args.channel).includes(AppSettings.QUEUE_BASE_NAME)
        ? this.messageBusUseCases
            .get<EventEmitter>(QueueClientEnum.TSK_QUEUE_LISTENER_EMITTER)
            .emit(QueueClientEnum.TSK_QUEUE_LISTENER_EMITTER, {
              queueName: args.channel,
              topicName: message?.topicName as TopicNameEnum,
            })
        : this.messageBusUseCases
            .get<BaseUseCase<EventMessage<MessageTypes>>>(`${args.channel}:${message?.topicName}`)
            .execute(TypeParser.cast<EventMessage<MessageTypes>>(message));
    } catch (error) {
      console.error(MessageBusHandler.name, new Date().toISOString(), error);
    }

    return Promise.resolve();
  }
}

export default new MessageBusHandler(messageBusUseCasesContainer);
