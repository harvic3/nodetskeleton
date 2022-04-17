import busContainer, { EventClientEnum, EventPublisher } from "../../../messaging/bus/container";
import queueContainer, { EventQueue, QueueClientEnum } from "../../../messaging/queue/container";
import { RegisterUserUseCase } from "../../../../application/modules/users/useCases/register";
import providerContainer, { LogProvider, WorkerProvider } from "../../../providers/container";
import repositoryContainer, { UserRepository } from "../../../repositories/container";
import { ContainerDictionary } from "../../../shared/dic/ContainerDictionary";
import { ServiceContainer } from "../../../shared/dic/ServiceContainer";

const dictionary = new ContainerDictionary();
dictionary.addScoped(
  RegisterUserUseCase.name,
  () =>
    new RegisterUserUseCase(
      providerContainer.get<LogProvider>(LogProvider.name),
      repositoryContainer.get<UserRepository>(UserRepository.name),
      providerContainer.get<WorkerProvider>(WorkerProvider.name),
      busContainer.get<EventPublisher>(EventClientEnum.TSK_BUS_PUBLISHER),
      queueContainer.get<EventQueue>(QueueClientEnum.TSK_QUEUE_PUBLISHER),
    ),
);

export { RegisterUserUseCase };
export default new ServiceContainer(dictionary);
