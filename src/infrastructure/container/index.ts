import { UserRepository } from "../../adapters/repositories/user/User.repository";
import kernel, { TSKernel } from "../../adapters/shared/kernel/TSKernel";
import { LogProvider } from "../../adapters/providers/log/Log.provider";
import { UserModel } from "../dataBases/nodeTsKeleton/User.model";
import { Logger } from "../logger/Logger";

class InfrastructureServiceContainer {
  constructor(readonly tsKernel: TSKernel) {}

  load(): void {
    // Load Providers to kernel
    this.tsKernel.addSingleton(this.tsKernel.classToIName(LogProvider.name), new Logger());

    // Load Model Repositories to kernel
    this.tsKernel.addSingleton(this.tsKernel.classToIName(UserRepository.name), new UserModel());
  }
}

export default new InfrastructureServiceContainer(kernel);
