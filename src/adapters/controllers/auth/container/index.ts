import { LogoutUseCase } from "../../../../application/modules/auth/useCases/logout";
import { LoginUseCase } from "../../../../application/modules/auth/useCases/login";
import { AuthProvider, LogProvider } from "../../../providers/container";
import kernel from "../../../shared/kernel";

const CONTEXT = "AuthControllerContainer";

kernel.addScoped(
  LoginUseCase.name,
  () =>
    new LoginUseCase(
      kernel.get<LogProvider>(CONTEXT, LogProvider.name),
      kernel.get<AuthProvider>(CONTEXT, AuthProvider.name),
    ),
);

kernel.addScoped(
  LogoutUseCase.name,
  () =>
    new LogoutUseCase(
      kernel.get<LogProvider>(CONTEXT, LogProvider.name),
      kernel.get<AuthProvider>(CONTEXT, AuthProvider.name),
    ),
);

export { LogoutUseCase, LoginUseCase };
export default kernel;
