import { HealthProvider } from "../health/HealthProvider";
import { AuthProvider } from "../auth/AuthProvider";
import { DateProvider } from "../shared/ports/DateProvider";
import { UuidProvider } from "../shared/ports/UuidProvider";

const authProvider = new AuthProvider();

const healthProvider = new HealthProvider();

const dateProvider = new DateProvider();

const uuidProvider = new UuidProvider();

export { healthProvider, authProvider, dateProvider, uuidProvider };
