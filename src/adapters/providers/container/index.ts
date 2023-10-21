import { UserRepository } from "../../repositories/user/User.repository";
import { BaseHttpClient } from "../../shared/httpClient/BaseHttpClient";
import { IUserModel } from "../../repositories/user/IUser.model";
import { HealthProvider } from "../health/Health.provider";
import { WorkerProvider } from "../worker/Worker.provider";
import { AuthProvider } from "../auth/Auth.provider";
import { LogProvider } from "../log/Log.provider";
import kernel from "../../shared/kernel";
import { ILogger } from "../log/ILogger";

const CONTEXT = "ProviderContainer";

export function loadProviders() {
  kernel.addSingleton(
    LogProvider.name,
    new LogProvider(kernel.get<ILogger>(CONTEXT, kernel.classToInterfaceName(LogProvider.name))),
  );
  kernel.addSingleton(
    AuthProvider.name,
    new AuthProvider(
      kernel.get<LogProvider>(CONTEXT, LogProvider.name),
      kernel.get<IUserModel>(CONTEXT, kernel.classToInterfaceName(UserRepository.name)),
    ),
  );
  kernel.addSingleton(
    HealthProvider.name,
    new HealthProvider(kernel.get<BaseHttpClient>(CONTEXT, BaseHttpClient.name)),
  );
  kernel.addSingleton(
    WorkerProvider.name,
    new WorkerProvider(kernel.get<LogProvider>(CONTEXT, LogProvider.name)),
  );
}

export { LogProvider, AuthProvider, HealthProvider, WorkerProvider };
export default kernel;
