import { RegisterUserUseCase } from "../../../../application/modules/users/useCases/register";
import { ContainerDictionary } from "../../../shared/dic/ContainerDictionary";
import { logProvider, workerProvider } from "../../../providers/container";
import { ServiceContainer } from "../../../shared/dic/ServiceContainer";
import { userRepository } from "../../../repositories/container";

const dictionary = new ContainerDictionary();
dictionary.add(
  RegisterUserUseCase.name,
  () => new RegisterUserUseCase(logProvider, userRepository, workerProvider),
);

export { RegisterUserUseCase };
export default new ServiceContainer(dictionary);
