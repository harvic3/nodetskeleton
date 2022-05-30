import { UserRepository } from "../../adapters/repositories/user/User.repository";
import { LogProvider } from "../../adapters/providers/log/Log.provider";
import { TSKernel } from "../../adapters/shared/kernel/tsk/TSKernel";
import { UserModel } from "../dataBases/nodeTsKeleton/User.model";
import kernel from "../../adapters/shared/kernel";
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
