import { BaseUseCase, IResult, Result } from "../../../../../../shared/useCase/BaseUseCase";
import { ILogProvider } from "../../../../../../shared/log/providerContracts/ILogProvider";
import { ChannelNameEnum } from "../../../../../../shared/messaging/ChannelName.enum";
import { BooleanUtil } from "../../../../../../../domain/shared/utils/BooleanUtil";
import { IEventQueue } from "../../../../../../shared/messaging/queue/IEventQueue";
import { LocaleTypeEnum } from "../../../../../../shared/locals/LocaleType.enum";
import { IUSerRepository } from "../../../../providerContracts/IUser.repository";
import { EventMessage } from "../../../../../../shared/messaging/EventMessage";
import { UseCaseTrace } from "../../../../../../shared/log/UseCaseTrace";
import { LastLoginDto } from "../../dtos/LastLoginDto";

export class ManageLastLoginEventUseCase extends BaseUseCase<IEventQueue> {
  private readonly channelName = ChannelNameEnum.QUEUE_SECURITY;

  constructor(readonly logProvider: ILogProvider, private readonly userProvider: IUSerRepository) {
    super(ManageLastLoginEventUseCase.name, logProvider);
  }

  async execute(
    locale: LocaleTypeEnum,
    _trace: UseCaseTrace,
    eventQueue: IEventQueue,
  ): Promise<IResult> {
    this.setLocale(locale);
    const result = new Result();
    while (true) {
      const message = await eventQueue.pop<EventMessage<LastLoginDto>>(this.channelName);
      if (!message) break;
      console.log(ChannelNameEnum.QUEUE_SECURITY, message);
    }

    return result;
  }
}
