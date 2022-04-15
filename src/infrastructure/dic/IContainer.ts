export interface IContainerDictionary {
  [className: string]: Function;
}

export interface IContainer {
  get<T>(className: string): T;
}
