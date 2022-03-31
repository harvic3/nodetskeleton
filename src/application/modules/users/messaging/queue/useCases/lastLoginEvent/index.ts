import { BaseUseCase, IResult, Result } from "../../../../../../shared/useCase/BaseUseCase";
import { ILogProvider } from "../../../../../../shared/log/providerContracts/ILogProvider";
import { ChannelNameEnum } from "../../../../../../shared/messaging/ChannelName.enum";
import { BooleanUtil } from "../../../../../../../domain/shared/utils/BooleanUtil";
import { IEventQueue } from "../../../../../../shared/messaging/queue/IEventQueue";
import { IUSerRepository } from "../../../../providerContracts/IUser.repository";
import { EventMessage } from "../../../../../../shared/messaging/EventMessage";
import { ILastLogin } from "../../dtos/ILastLogin";

export class ManageLastLoginEventUseCase extends BaseUseCase<IEventQueue> {
  private readonly channelName = ChannelNameEnum.QUEUE_SECURITY;

  constructor(readonly logProvider: ILogProvider, private readonly userProvider: IUSerRepository) {
    super(ManageLastLoginEventUseCase.name, logProvider);
  }

  async execute(eventQueue: IEventQueue): Promise<IResult> {
    const result = new Result();
    while (BooleanUtil.YES) {
      const message = await eventQueue.pop<EventMessage<ILastLogin>>(this.channelName);
      if (!message) break;
      console.log(ChannelNameEnum.QUEUE_SECURITY, message);
    }

    return result;
  }
}
