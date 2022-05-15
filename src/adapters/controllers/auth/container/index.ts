import { AuthProvider, LogProvider } from "../../../providers/container";
import { LoginUseCase } from "../../../../application/modules/auth/useCases/login";
import kernel from "../../../shared/kernel";

const CONTEXT = `AuthControllerContainer`;

kernel.addScoped(
  LoginUseCase.name,
  () =>
    new LoginUseCase(
      kernel.get<LogProvider>(CONTEXT, LogProvider.name),
      kernel.get<AuthProvider>(CONTEXT, AuthProvider.name),
    ),
);

export { LoginUseCase };
export default kernel;
