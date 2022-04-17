import { ContainerDictionary } from "../../shared/dic/ContainerDictionary";
import { ServiceContainer } from "../../shared/dic/ServiceContainer";
import { HealthProvider } from "../health/Health.provider";
import logger from "../../../infrastructure/logger/Logger";
import { WorkerProvider } from "../worker/Worker.provider";
import { AuthProvider } from "../auth/Auth.provider";
import { LogProvider } from "../log/Log.provider";

const authProvider = new AuthProvider();

const dictionary = new ContainerDictionary();
dictionary.addSingleton(LogProvider.name, new LogProvider(logger));
dictionary.addSingleton(AuthProvider.name, authProvider);
dictionary.addSingleton(HealthProvider.name, new HealthProvider());
dictionary.addSingleton(WorkerProvider.name, new WorkerProvider());

export { authProvider, LogProvider, AuthProvider, HealthProvider, WorkerProvider };
export default new ServiceContainer(dictionary);
