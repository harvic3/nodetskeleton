import { IContainer } from "./IContainer";

export class Container {
  static get<T>(useCaseClassName: string, container: IContainer): T {
    return container[useCaseClassName]() as T;
  }
}
