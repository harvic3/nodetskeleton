import { NotFoundUseCase } from "../../../../application/modules/health/useCases/default";
import { PongUseCase } from "../../../../application/modules/health/useCases/pong";
import { healthProvider, logProvider } from "../../../providers/container/index";
import { ContainerDictionary } from "../../../shared/dic/ContainerDictionary";
import { ServiceContainer } from "../../../shared/dic/ServiceContainer";

const dictionary = new ContainerDictionary();
dictionary.add(PongUseCase.name, () => new PongUseCase(logProvider, healthProvider));
dictionary.add(NotFoundUseCase.name, () => new NotFoundUseCase(logProvider, healthProvider));

export { PongUseCase, NotFoundUseCase };
export default new ServiceContainer(dictionary);
