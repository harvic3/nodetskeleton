import { RegisterUserUseCase } from "../../../../application/modules/users/useCases/register";
import { LoginUseCase } from "../../../../application/modules/auth/useCases/login";
import { Container, IContainerDictionary } from "../../../shared/Container";
import { userRepository } from "../../../repositories/container";
import { authProvider } from "../../../providers/container";

const dictionary: IContainerDictionary = {};
dictionary[LoginUseCase.name] = () => new LoginUseCase(authProvider);
dictionary[RegisterUserUseCase.name] = () => new RegisterUserUseCase(userRepository);

export default new Container(dictionary);
