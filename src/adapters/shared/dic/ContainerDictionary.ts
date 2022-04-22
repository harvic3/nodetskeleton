import { ApplicationError } from "../../../application/shared/errors/ApplicationError";
import applicationStatus from "../../../application/shared/status/applicationStatus";
import appMessages from "../../../application/shared/locals/messages";
import { IContainerDictionary } from "./IContainerDictionary";

export class ContainerDictionary implements IContainerDictionary {
  #value: Record<string, Function> = {};

  addScoped(className: string, activator: Function): void {
    this.#value[className] = activator;
  }

  addSingleton(className: string, object: object): void {
    this.#value[className] = () => object;
  }

  getDictionary(): Record<string, Function> {
    return this.#value;
  }

  getCopy<T>(className: string): T {
    if (!this.#value[className]) {
      throw new ApplicationError(
        ContainerDictionary.name,
        appMessages.getWithParams(appMessages.keys.DEPENDENCY_NOT_FOUNT, { className }),
        applicationStatus.INTERNAL_ERROR,
      );
    }

    return this.#value[className]() as T;
  }
}
