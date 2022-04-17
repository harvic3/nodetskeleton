import { IContainerDictionary } from "./IContainerDictionary";

export class ContainerDictionary implements IContainerDictionary {
  private value: Record<string, Function> = {};

  addScoped(className: string, activator: Function): void {
    this.value[className] = activator;
  }

  addSingleton(className: string, object: object): void {
    this.value[className] = () => object;
  }

  getDictionary(): Record<string, Function> {
    return this.value;
  }
}
