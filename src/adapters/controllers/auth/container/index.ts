import providerContainer, { AuthProvider, LogProvider } from "../../../providers/container";
import { LoginUseCase } from "../../../../application/modules/auth/useCases/login";
import { ContainerDictionary } from "../../../shared/dic/ContainerDictionary";
import { ServiceContainer } from "../../../shared/dic/ServiceContainer";

const dictionary = new ContainerDictionary();
dictionary.addScoped(
  LoginUseCase.name,
  () =>
    new LoginUseCase(
      providerContainer.get<LogProvider>(LogProvider.name),
      providerContainer.get<AuthProvider>(AuthProvider.name),
    ),
);

export { LoginUseCase };
export default new ServiceContainer(dictionary);
