import { ApplicationError } from "../shared/errors/ApplicationError";
import { IMockBuilder } from "./mockContracts/IMockBuilder";

export class ApplicationErrorMock implements IMockBuilder<ApplicationError> {
  private applicationError = new ApplicationError(ApplicationErrorMock.name, "", "");

  reset(): ApplicationError {
    this.applicationError = new ApplicationError(ApplicationErrorMock.name, "", "");
    return this.applicationError;
  }

  build(): ApplicationError {
    return this.applicationError;
  }

  initialize(context: string, error: string, errorCode: string): ApplicationErrorMock {
    this.applicationError = new ApplicationError(context, error, errorCode);
    return this;
  }
}
