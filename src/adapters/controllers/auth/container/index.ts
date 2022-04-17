import { LoginUseCase } from "../../../../application/modules/auth/useCases/login";
import { ContainerDictionary } from "../../../shared/dic/ContainerDictionary";
import { authProvider, logProvider } from "../../../providers/container";
import { ServiceContainer } from "../../../shared/dic/ServiceContainer";

const dictionary = new ContainerDictionary();
dictionary.add(LoginUseCase.name, () => new LoginUseCase(logProvider, authProvider));

export { LoginUseCase };
export default new ServiceContainer(dictionary);
