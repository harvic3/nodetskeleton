import { Container, IContainerDictionary } from "../../../../infrastructure/dic/Container";
import { NotFoundUseCase } from "../../../../application/modules/health/useCases/default";
import { PongUseCase } from "../../../../application/modules/health/useCases/pong";
import { healthProvider, logProvider } from "../../../providers/container/index";

const dictionary: IContainerDictionary = {};
dictionary[PongUseCase.name] = () => new PongUseCase(logProvider, healthProvider);
dictionary[NotFoundUseCase.name] = () => new NotFoundUseCase(logProvider, healthProvider);

export { PongUseCase, NotFoundUseCase };
export default new Container(dictionary);
