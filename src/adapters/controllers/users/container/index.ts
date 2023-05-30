import { RegisterUserUseCase } from "../../../../application/modules/users/useCases/register";
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

export { RegisterUserUseCase };
export default kernel;
