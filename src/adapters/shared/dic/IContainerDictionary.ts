export interface IContainerDictionary {
  addScoped(className: string, activator: Function): void;
  addSingleton(className: string, object: object): void;
  getDictionary(): Record<string, Function>;
  getCopy<T>(className: string): T;
}
