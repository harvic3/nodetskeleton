import { HealthProvider } from "../health/HealthProvider";
import { AuthProvider } from "../auth/AuthProvider";

const authProvider = new AuthProvider();

const healthProvider = new HealthProvider();

export { healthProvider, authProvider };
