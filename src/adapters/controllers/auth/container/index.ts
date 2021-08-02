import { RegisterUserUseCase } from "../../../../application/modules/users/useCases/register";
import { LoginUseCase } from "../../../../application/modules/auth/useCases/login";
import { userRepository } from "../../../repositories/container";
import { authProvider } from "../../../providers/container";
import { IContainer } from "../../../shared/IContainer";

const container: IContainer = {};
container[LoginUseCase.name] = () => new LoginUseCase(authProvider);
container[RegisterUserUseCase.name] = () => new RegisterUserUseCase(userRepository);

export default container;
