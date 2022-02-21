import { ApplicationError } from "../../application/shared/errors/ApplicationError";
import resources, { resourceKeys } from "../../application/shared/locals/messages";
import applicationStatus from "../../application/shared/status/applicationStatus";

export class Container {
  constructor(private readonly container: IContainerDictionary) {}

  get<T>(className: string): T {
    if (!this.container[className]) {
      throw new ApplicationError(
        Container.name,
        resources.getWithParams(resourceKeys.DEPENDENCY_NOT_FOUNT, { className }),
        applicationStatus.INTERNAL_ERROR,
      );
    }

    return this.container[className]() as T;
  }
}

export interface IContainerDictionary {
  [className: string]: Function;
}
