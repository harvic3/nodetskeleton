import { IContainerDictionary } from "./IContainerDictionary";

export class ContainerDictionary implements IContainerDictionary {
  private value: Record<string, Function> = {};

  add(className: string, activator: Function): void {
    this.value[className] = activator;
  }

  getDictionary(): Record<string, Function> {
    return this.value;
  }
}
