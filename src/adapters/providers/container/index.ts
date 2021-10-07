import { HealthProvider } from "../health/Health.provider";
import { AuthProvider } from "../auth/Auth.provider";
import { WorkerProvider } from "../worker/WorkerProvider";

const authProvider = new AuthProvider();

const healthProvider = new HealthProvider();

const workerProvider = new WorkerProvider();

export { healthProvider, authProvider, workerProvider };
