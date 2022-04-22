import { ContainerDictionary } from "../../shared/dic/ContainerDictionary";
import { ServiceContainer } from "../../shared/dic/ServiceContainer";
import { HealthProvider } from "../health/Health.provider";
import logger from "../../../infrastructure/logger/Logger";
import { WorkerProvider } from "../worker/Worker.provider";
import { AuthProvider } from "../auth/Auth.provider";
import { LogProvider } from "../log/Log.provider";

const dictionary = new ContainerDictionary();
dictionary.addSingleton(LogProvider.name, new LogProvider(logger));
dictionary.addSingleton(
  AuthProvider.name,
  new AuthProvider(dictionary.getCopy<LogProvider>(LogProvider.name)),
);
dictionary.addSingleton(HealthProvider.name, new HealthProvider());
dictionary.addSingleton(
  WorkerProvider.name,
  new WorkerProvider(dictionary.getCopy<LogProvider>(LogProvider.name)),
);

export { LogProvider, AuthProvider, HealthProvider, WorkerProvider };
export default new ServiceContainer(dictionary);
