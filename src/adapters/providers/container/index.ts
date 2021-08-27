import { HealthProvider } from "../health/Health.provider";
import { AuthProvider } from "../auth/Auth.provider";

const authProvider = new AuthProvider();

const healthProvider = new HealthProvider();

export { healthProvider, authProvider };
