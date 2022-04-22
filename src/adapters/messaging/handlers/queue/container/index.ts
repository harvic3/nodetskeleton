import { ManageUserCreatedEventUseCase } from "../../../../../application/modules/auth/messaging/queue/useCases/userCreatedEvent";
import { ManageLastLoginEventUseCase } from "../../../../../application/modules/users/messaging/queue/useCases/lastLoginEvent";
import repositoryContainer, { UserRepository } from "../../../../repositories/container";
import { ContainerDictionary } from "../../../../shared/dic/ContainerDictionary";
import providerContainer, { LogProvider } from "../../../../providers/container";
import { ServiceContainer } from "../../../../shared/dic/ServiceContainer";

const dictionary = new ContainerDictionary();
dictionary.addScoped(
  ManageUserCreatedEventUseCase.name,
  () => new ManageUserCreatedEventUseCase(providerContainer.get<LogProvider>(LogProvider.name)),
);
dictionary.addScoped(
  ManageLastLoginEventUseCase.name,
  () =>
    new ManageLastLoginEventUseCase(
      providerContainer.get<LogProvider>(LogProvider.name),
      repositoryContainer.get<UserRepository>(UserRepository.name),
    ),
);

export { ManageUserCreatedEventUseCase, ManageLastLoginEventUseCase };
export default new ServiceContainer(dictionary);
