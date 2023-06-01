import { BaseUseCase, IResult, Result } from "../../../../../../shared/useCase/BaseUseCase";
import { ILogProvider } from "../../../../../../shared/log/providerContracts/ILogProvider";
import { ChannelNameEnum } from "../../../../../../shared/messaging/ChannelName.enum";
import { IEventQueue } from "../../../../../../shared/messaging/queue/IEventQueue";
import { LocaleTypeEnum } from "../../../../../../shared/locals/LocaleType.enum";
import { EventMessage } from "../../../../../../shared/messaging/EventMessage";
import { UseCaseTrace } from "../../../../../../shared/log/UseCaseTrace";
import { IUser } from "../../../../../../../domain/user/IUser";

export class ManageUserCreatedEventUseCase extends BaseUseCase<IEventQueue> {
  private readonly channelName = ChannelNameEnum.QUEUE_USERS;

  constructor(readonly logProvider: ILogProvider) {
    super(ManageUserCreatedEventUseCase.name, logProvider);
  }

  async execute(
    locale: LocaleTypeEnum,
    _trace: UseCaseTrace,
    eventQueue: IEventQueue,
  ): Promise<IResult> {
    const result = new Result();
    while (true) {
      const message = await eventQueue.pop<EventMessage<IUser>>(this.channelName);
      if (!message) break;
      console.log(`${ChannelNameEnum.QUEUE_USERS} ${new Date().toISOString()}`, message);
    }

    return result;
  }
}
