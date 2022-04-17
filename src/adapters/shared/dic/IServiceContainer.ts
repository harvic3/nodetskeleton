import { ServiceContext } from "../ServiceContext";
import { IContainerDictionary } from "./IContainerDictionary";

export interface IServiceContainer {
  setContext(context: ServiceContext): void;
  get<T>(className: string): T;
  addDictionary(dictionary: IContainerDictionary): void;
}
