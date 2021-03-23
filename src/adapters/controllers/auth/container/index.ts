import { RegisterUserUseCase } from "../../../../application/modules/users/useCases/register";
import { LoginUseCase } from "../../../../application/modules/auth/useCases/login";
import { userRepository } from "../../../repositories/container";
import { authProvider } from "../../../providers/container";

const loginUseCase = new LoginUseCase(authProvider);
const registerUseCase = new RegisterUserUseCase(userRepository);

export { loginUseCase, registerUseCase };
