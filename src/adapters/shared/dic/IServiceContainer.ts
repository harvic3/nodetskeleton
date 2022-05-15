export interface IServiceContainer {
  addScoped(className: string, activator: Function): void;
  addSingleton(className: string, object: object): void;
  get<T>(context: string, className: string): T;
}
