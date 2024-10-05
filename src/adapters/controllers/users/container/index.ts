import { RegisterUserUseCase } from "../../../../application/modules/users/useCases/register";
import { GetUserUseCase } from "../../../../application/modules/users/useCases/get";
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
    ),
);
kernel.addScoped(
  GetUserUseCase.name,
  () =>
    new GetUserUseCase(
      kernel.get<LogProvider>(CONTEXT, LogProvider.name),
      kernel.get<UserRepository>(CONTEXT, UserRepository.name),
    ),
);

export { RegisterUserUseCase, GetUserUseCase };
export default kernel;
