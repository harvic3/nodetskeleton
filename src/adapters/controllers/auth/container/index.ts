import { RegisterUserUseCase } from "../../../../application/modules/users/useCases/register";
import { Container, IContainerDictionary } from "../../../../infrastructure/ioc/Container";
import { LoginUseCase } from "../../../../application/modules/auth/useCases/login";
import { userRepository } from "../../../repositories/container";
import { authProvider } from "../../../providers/container";

const dictionary: IContainerDictionary = {};
dictionary[LoginUseCase.name] = () => new LoginUseCase(authProvider);
dictionary[RegisterUserUseCase.name] = () => new RegisterUserUseCase(userRepository);

export { LoginUseCase, RegisterUserUseCase };
export default new Container(dictionary);
