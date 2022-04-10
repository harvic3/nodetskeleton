import busContainer, { EventClientEnum, EventPublisher } from "../../../messaging/bus/container";
import queueContainer, { EventQueue, QueueClientEnum } from "../../../messaging/queue/container";
import { RegisterUserUseCase } from "../../../../application/modules/users/useCases/register";
import { Container, IContainerDictionary } from "../../../../infrastructure/dic/Container";
import { logProvider, workerProvider } from "../../../providers/container";
import { userRepository } from "../../../repositories/container";

const dictionary: IContainerDictionary = {};
dictionary[RegisterUserUseCase.name] = () =>
  new RegisterUserUseCase(
    logProvider,
    userRepository,
    workerProvider,
    busContainer.get<EventPublisher>(EventClientEnum.TSK_BUS_PUBLISHER),
    queueContainer.get<EventQueue>(QueueClientEnum.TSK_QUEUE_PUBLISHER),
  );

export { RegisterUserUseCase };
export default new Container(dictionary);
