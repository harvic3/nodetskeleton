import { IEventPublisher } from "../../../../application/shared/messaging/bus/IEventPublisher";
import { LoginUseCase } from "../../../../application/modules/auth/useCases/login";
import { CacheProviderEnum } from "../../../providers/cache/CacheProvider.enum";
import { QueueClientEnum } from "../../../messaging/queue/QueueClient.enum";
import { EventQueue } from "../../../messaging/queue/publisher/EventQueue";
import { AuthProvider, LogProvider } from "../../../providers/container";
import { CacheProvider } from "../../../providers/cache/Cache.provider";
import { EventClientEnum } from "../../../messaging/bus/container";
import kernel from "../../../shared/kernel";

const CONTEXT = "AuthControllerContainer";

kernel.addScoped(
  LoginUseCase.name,
  () =>
    new LoginUseCase(
      kernel.get<LogProvider>(CONTEXT, LogProvider.name),
      kernel.get<AuthProvider>(CONTEXT, AuthProvider.name),
      kernel.get<IEventPublisher>(CONTEXT, EventClientEnum.TSK_BUS_PUBLISHER),
      kernel.get<EventQueue>(CONTEXT, QueueClientEnum.TSK_QUEUE_PUBLISHER),
      kernel.get<CacheProvider>(CONTEXT, CacheProviderEnum.AUTH),
    ),
);

export { LoginUseCase };
export default kernel;
