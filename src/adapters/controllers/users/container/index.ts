import { RegisterUserUseCase } from "../../../../application/modules/users/useCases/register";
import { Container, IContainerDictionary } from "../../../../infrastructure/ioc/Container";
import { userRepository } from "../../../repositories/container";
import { logProvider, workerProvider } from "../../../providers/container";

const dictionary: IContainerDictionary = {};
dictionary[RegisterUserUseCase.name] = () =>
  new RegisterUserUseCase(logProvider, userRepository, workerProvider);

export { RegisterUserUseCase };
export default new Container(dictionary);
