import { PongUseCase } from "../../../../application/modules/health/useCases/pong";
import { healthProvider } from "../../../providers/container/index";

const pongUseCase = new PongUseCase(healthProvider);

export { pongUseCase };
