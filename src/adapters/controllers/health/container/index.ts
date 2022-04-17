import providerContainer, { LogProvider, HealthProvider } from "../../../providers/container";
import { NotFoundUseCase } from "../../../../application/modules/health/useCases/default";
import { PongUseCase } from "../../../../application/modules/health/useCases/pong";
import { ContainerDictionary } from "../../../shared/dic/ContainerDictionary";
import { ServiceContainer } from "../../../shared/dic/ServiceContainer";

const dictionary = new ContainerDictionary();
dictionary.addScoped(
  PongUseCase.name,
  () =>
    new PongUseCase(
      providerContainer.get<LogProvider>(LogProvider.name),
      providerContainer.get<HealthProvider>(HealthProvider.name),
    ),
);
dictionary.addScoped(
  NotFoundUseCase.name,
  () =>
    new NotFoundUseCase(
      providerContainer.get<LogProvider>(LogProvider.name),
      providerContainer.get<HealthProvider>(HealthProvider.name),
    ),
);

export { PongUseCase, NotFoundUseCase };
export default new ServiceContainer(dictionary);
