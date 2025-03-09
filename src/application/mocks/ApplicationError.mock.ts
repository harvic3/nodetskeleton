import { ApplicationError } from "../shared/errors/ApplicationError";
import { StringUtil } from "../../domain/shared/utils/StringUtil";
import { MockBuilder } from "./builder/mockBuilder.mock";

export class ApplicationErrorMock extends MockBuilder<ApplicationError> {
  constructor() {
    super();
    this.reset();
  }

  private initialize(): ApplicationError {
    return new ApplicationError(ApplicationErrorMock.name, StringUtil.EMPTY, StringUtil.EMPTY);
  }

  reset(): ApplicationError {
    this.mock = this.initialize();

    return this.mock;
  }

  build(): ApplicationError {
    return this.mock;
  }

  set(context: string, error: string, errorCode: string): ApplicationErrorMock {
    this.create(new ApplicationError(context, error, errorCode));

    return this;
  }
}
