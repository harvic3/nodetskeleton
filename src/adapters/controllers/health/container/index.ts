import { PongUseCase } from "../../../../application/modules/health/useCases/pong";
import { healthProvider } from "../../../providers/container/index";
import { IContainer } from "../../../shared/IContainer";

const container: IContainer = {};
container[PongUseCase.name] = () => new PongUseCase(healthProvider);

export default container;
