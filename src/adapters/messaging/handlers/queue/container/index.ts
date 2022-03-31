import { ManageUserCreatedEventUseCase } from "../../../../../application/modules/auth/messaging/queue/useCases/userCreatedEvent";
import { ManageLastLoginEventUseCase } from "../../../../../application/modules/users/messaging/queue/useCases/lastLoginEvent";
import { Container, IContainerDictionary } from "../../../../../infrastructure/ioc/Container";
import { userRepository } from "../../../../repositories/container";
import { logProvider } from "../../../../providers/container";

const dictionary: IContainerDictionary = {};
dictionary[ManageUserCreatedEventUseCase.name] = () =>
  new ManageUserCreatedEventUseCase(logProvider);
dictionary[ManageLastLoginEventUseCase.name] = () =>
  new ManageLastLoginEventUseCase(logProvider, userRepository);

export { ManageUserCreatedEventUseCase, ManageLastLoginEventUseCase };
export default new Container(dictionary);
