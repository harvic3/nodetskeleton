import { NotFoundUseCase } from "../../../../application/modules/status/useCases/default";
import { PongUseCase } from "../../../../application/modules/status/useCases/pong";
import { LogProvider, HealthProvider } from "../../../providers/container";
import kernel from "../../../shared/kernel";

const CONTEXT = "HealthControllerContainer";

kernel.addScoped(
  PongUseCase.name,
  () =>
    new PongUseCase(
      kernel.get<LogProvider>(CONTEXT, LogProvider.name),
      kernel.get<HealthProvider>(CONTEXT, HealthProvider.name),
    ),
);
kernel.addScoped(
  NotFoundUseCase.name,
  () =>
    new NotFoundUseCase(
      kernel.get<LogProvider>(CONTEXT, LogProvider.name),
      kernel.get<HealthProvider>(CONTEXT, HealthProvider.name),
    ),
);

export { PongUseCase, NotFoundUseCase };
export default kernel;
