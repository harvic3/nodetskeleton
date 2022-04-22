import { ApplicationError } from "../../../application/shared/errors/ApplicationError";
import applicationStatus from "../../../application/shared/status/applicationStatus";
import appMessages from "../../../application/shared/locals/messages";
import { IContainerDictionary } from "./IContainerDictionary";
import { IServiceContainer } from "./IServiceContainer";
import { ServiceContext } from "../ServiceContext";

export class ServiceContainer implements IServiceContainer {
  #context?: string;
  #value: Record<string, Function> = {};

  constructor(dictionary?: IContainerDictionary) {
    if (dictionary) {
      this.#value = dictionary.getDictionary();
    }
  }

  setContext(context: ServiceContext): void {
    this.#context = `${ServiceContainer.name}_${context}`;
  }

  get<T>(className: string): T {
    if (!this.#value[className]) {
      throw new ApplicationError(
        this.#context || ServiceContainer.name,
        appMessages.getWithParams(appMessages.keys.DEPENDENCY_NOT_FOUNT, { className }),
        applicationStatus.INTERNAL_ERROR,
      );
    }

    return this.#value[className]() as T;
  }

  addDictionary(dictionary: IContainerDictionary): void {
    this.#value = { ...this.#value, ...dictionary.getDictionary() };
  }
}
