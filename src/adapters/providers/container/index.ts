import { HealthProvider } from "../health/Health.provider";
import logger from "../../../infrastructure/logger/Logger";
import { WorkerProvider } from "../worker/WorkerProvider";
import { AuthProvider } from "../auth/Auth.provider";
import { LogProvider } from "../log/LogProvider";

const logProvider = new LogProvider(logger);

const authProvider = new AuthProvider();

const healthProvider = new HealthProvider();

const workerProvider = new WorkerProvider();

export { logProvider, healthProvider, authProvider, workerProvider };
