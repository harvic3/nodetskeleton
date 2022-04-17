export interface IContainerDictionary {
  add(className: string, activator: Function): void;
  getDictionary(): Record<string, Function>;
}
