import { RegisterUserUseCase } from "../../../../application/modules/users/useCases/register";
import { EventClientEnum, EventPublisher } from "../../../messaging/bus/container";
import { EventQueue, QueueClientEnum } from "../../../messaging/queue/container";
import { LogProvider, WorkerProvider } from "../../../providers/container";
import { UserRepository } from "../../../repositories/container";
import kernel from "../../../shared/kernel";

const CONTEXT = "UsersControllerContainer";

kernel.addScoped(
  RegisterUserUseCase.name,
  () =>
    new RegisterUserUseCase(
      kernel.get<LogProvider>(CONTEXT, LogProvider.name),
      kernel.get<UserRepository>(CONTEXT, UserRepository.name),
      kernel.get<WorkerProvider>(CONTEXT, WorkerProvider.name),
      kernel.get<EventPublisher>(CONTEXT, EventClientEnum.TSK_BUS_PUBLISHER),
      kernel.get<EventQueue>(CONTEXT, QueueClientEnum.TSK_QUEUE_PUBLISHER),
    ),
);

export { RegisterUserUseCase };
export default kernel;
