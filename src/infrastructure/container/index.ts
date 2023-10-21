import { UseCaseTraceRepository } from "../../adapters/repositories/trace/UseCaseTrace.repository";
import { BaseHttpClient } from "../../adapters/shared/httpClient/BaseHttpClient";
import { loadRepositories } from "../../adapters/repositories/container";
import kernel, { IServiceContainer } from "../../adapters/shared/kernel";
import { LogProvider } from "../../adapters/providers/log/Log.provider";
import { loadProviders } from "../../adapters/providers/container";
import { LoadTSKDBModels } from "../dataBases/container";
import { HttpClient } from "../httpClient/HttpClient";
import { Logger } from "../logger/Logger";

class InfrastructureServiceContainer {
  constructor(readonly tsKernel: IServiceContainer) {}

  load(): void {
    // Load essential Providers to kernel
    this.tsKernel.addSingleton(this.tsKernel.classToInterfaceName(LogProvider.name), new Logger());
    this.tsKernel.addSingleton(UseCaseTraceRepository.name, new UseCaseTraceRepository());

    // Load essential services to kernel
    this.tsKernel.addSingleton(BaseHttpClient.name, new HttpClient());

    // Load Repository Models to kernel
    LoadTSKDBModels();

    // Load providers to kernel
    loadProviders();

    // Load repositories to kernel
    loadRepositories();
  }
}

export default new InfrastructureServiceContainer(kernel);
