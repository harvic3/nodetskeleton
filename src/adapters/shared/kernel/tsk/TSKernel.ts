import { ApplicationError } from "../../../../application/shared/errors/ApplicationError";
import applicationStatus from "../../../../application/shared/status/applicationStatus";
import appMessages from "../../../../application/shared/locals/messages";
import { IServiceContainer } from "../../dic/IServiceContainer";

export class TSKernel implements IServiceContainer {
  #serviceCollection: Record<string, Function> = {};

  addScoped(className: string, activator: Function): void {
    this.#serviceCollection[className] = activator;
  }

  addSingleton(className: string, object: object): void {
    this.#serviceCollection[className] = () => object;
  }

  get<T>(context: string, className: string): T {
    if (!this.#serviceCollection[className]) {
      throw new ApplicationError(
        context || TSKernel.name,
        appMessages.getWithParams(appMessages.keys.DEPENDENCY_NOT_FOUNT, { className }),
        applicationStatus.INTERNAL_ERROR,
      );
    }

    return this.#serviceCollection[className]() as T;
  }
}
