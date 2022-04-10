import { IEventPublisher } from "../../../../application/shared/messaging/bus/IEventPublisher";
import { Container, IContainerDictionary } from "../../../../infrastructure/dic/Container";
import { LoginUseCase } from "../../../../application/modules/auth/useCases/login";
import busContainer, { EventClientEnum } from "../../../messaging/bus/container";
import { authProvider, logProvider } from "../../../providers/container";

const dictionary: IContainerDictionary = {};
dictionary[LoginUseCase.name] = () =>
  new LoginUseCase(
    logProvider,
    authProvider,
    busContainer.get<IEventPublisher>(EventClientEnum.TSK_BUS_PUBLISHER),
  );

export { LoginUseCase };
export default new Container(dictionary);
