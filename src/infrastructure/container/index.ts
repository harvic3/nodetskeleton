import { UseCaseTraceRepository } from "../../adapters/repositories/trace/UseCaseTrace.repository";
import { UserRepository } from "../../adapters/repositories/user/User.repository";
import kernel, { IServiceContainer } from "../../adapters/shared/kernel";
import { LogProvider } from "../../adapters/providers/log/Log.provider";
import { UserModel } from "../dataBases/nodeTsKeleton/User.model";
import { Logger } from "../logger/Logger";

class InfrastructureServiceContainer {
  constructor(readonly tsKernel: IServiceContainer) {}

  load(): void {
    // Load Providers to kernel
    this.tsKernel.addSingleton(this.tsKernel.classToInterfaceName(LogProvider.name), new Logger());
    this.tsKernel.addSingleton(UseCaseTraceRepository.name, new UseCaseTraceRepository());

    // Load Model Repositories to kernel
    this.tsKernel.addSingleton(
      this.tsKernel.classToInterfaceName(UserRepository.name),
      new UserModel(),
    );
  }
}

export default new InfrastructureServiceContainer(kernel);
