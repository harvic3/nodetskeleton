import { ManageUserCreatedEventUseCase } from "../../../../../application/modules/auth/messaging/queue/useCases/userCreatedEvent";
import { ManageLastLoginEventUseCase } from "../../../../../application/modules/users/messaging/queue/useCases/lastLoginEvent";
import { UserRepository } from "../../../../repositories/container";
import { LogProvider } from "../../../../providers/container";
import kernel from "../../../../shared/kernel";

const CONTEXT = "QueueContainer";

kernel.addScoped(
  ManageUserCreatedEventUseCase.name,
  () => new ManageUserCreatedEventUseCase(kernel.get<LogProvider>(CONTEXT, LogProvider.name)),
);
kernel.addScoped(
  ManageLastLoginEventUseCase.name,
  () =>
    new ManageLastLoginEventUseCase(
      kernel.get<LogProvider>(CONTEXT, LogProvider.name),
      kernel.get<UserRepository>(CONTEXT, UserRepository.name),
    ),
);

export { ManageUserCreatedEventUseCase, ManageLastLoginEventUseCase };
export default kernel;
