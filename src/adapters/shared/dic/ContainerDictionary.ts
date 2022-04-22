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

  getService<T>(className: string): T {
    if (!this.#value[className]) {
      throw new Error(`Dependency ${className} not found`);
    }

    return this.#value[className]() as T;
  }
}
