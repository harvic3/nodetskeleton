import { RegisterUserUseCase } from "../../../../application/modules/users/useCases/register";
import { Container, IContainerDictionary } from "../../../../infrastructure/ioc/Container";
import { userRepository } from "../../../repositories/container";
import { workerProvider } from "../../../providers/container";

const dictionary: IContainerDictionary = {};
dictionary[RegisterUserUseCase.name] = () =>
  new RegisterUserUseCase(userRepository, workerProvider);

export { RegisterUserUseCase };
export default new Container(dictionary);
