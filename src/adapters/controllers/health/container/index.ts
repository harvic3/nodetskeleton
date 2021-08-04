import { PongUseCase } from "../../../../application/modules/health/useCases/pong";
import { Container, IContainerDictionary } from "../../../../infrastructure/ioc/Container";
import { healthProvider } from "../../../providers/container/index";

const dictionary: IContainerDictionary = {};
dictionary[PongUseCase.name] = () => new PongUseCase(healthProvider);

export default new Container(dictionary);
