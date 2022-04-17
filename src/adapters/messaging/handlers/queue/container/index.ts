import { ManageUserCreatedEventUseCase } from "../../../../../application/modules/auth/messaging/queue/useCases/userCreatedEvent";
import { ManageLastLoginEventUseCase } from "../../../../../application/modules/users/messaging/queue/useCases/lastLoginEvent";
import repositoryContainer, { UserRepository } from "../../../../repositories/container";
import { ContainerDictionary } from "../../../../shared/dic/ContainerDictionary";
import { ServiceContainer } from "../../../../shared/dic/ServiceContainer";
import { logProvider } from "../../../../providers/container";

const dictionary = new ContainerDictionary();
dictionary.addScoped(
  ManageUserCreatedEventUseCase.name,
  () => new ManageUserCreatedEventUseCase(logProvider),
);
dictionary.addScoped(
  ManageLastLoginEventUseCase.name,
  () =>
    new ManageLastLoginEventUseCase(
      logProvider,
      repositoryContainer.get<UserRepository>(UserRepository.name),
    ),
);

export { ManageUserCreatedEventUseCase, ManageLastLoginEventUseCase };
export default new ServiceContainer(dictionary);
