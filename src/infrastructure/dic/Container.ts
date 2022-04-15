import { ApplicationError } from "../../application/shared/errors/ApplicationError";
import applicationStatus from "../../application/shared/status/applicationStatus";
import appMessages from "../../application/shared/locals/messages";
import { IContainer, IContainerDictionary } from "./IContainer";

export { IContainerDictionary };

export class Container implements IContainer {
  constructor(private readonly container: IContainerDictionary) {}

  get<T>(className: string): T {
    if (!this.container[className]) {
      throw new ApplicationError(
        Container.name,
        appMessages.getWithParams(appMessages.keys.DEPENDENCY_NOT_FOUNT, { className }),
        applicationStatus.INTERNAL_ERROR,
      );
    }

    return this.container[className]() as T;
  }
}
