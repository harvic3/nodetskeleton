import { IEventPublisher } from "../../../../application/shared/messaging/bus/IEventPublisher";
import providerContainer, { AuthProvider, LogProvider } from "../../../providers/container";
import { LoginUseCase } from "../../../../application/modules/auth/useCases/login";
import busContainer, { EventClientEnum } from "../../../messaging/bus/container";
import { ContainerDictionary } from "../../../shared/dic/ContainerDictionary";
import { ServiceContainer } from "../../../shared/dic/ServiceContainer";

const dictionary = new ContainerDictionary();
dictionary.addScoped(
  LoginUseCase.name,
  () =>
    new LoginUseCase(
      providerContainer.get<LogProvider>(LogProvider.name),
      providerContainer.get<AuthProvider>(AuthProvider.name),
      busContainer.get<IEventPublisher>(EventClientEnum.TSK_BUS_PUBLISHER),
    ),
);

export { LoginUseCase };
export default new ServiceContainer(dictionary);
