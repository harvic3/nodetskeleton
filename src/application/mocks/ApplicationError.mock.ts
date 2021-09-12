import { ApplicationError } from "../shared/errors/ApplicationError";
import { IMockBuilder } from "./mockContracts/IMockBuilder";

export class ApplicationErrorMock implements IMockBuilder<ApplicationError> {
  private applicationError: ApplicationError;

  reset(): ApplicationError {
    this.applicationError = new ApplicationError(null, null);
    return this.applicationError;
  }
  build(): ApplicationError {
    return this.applicationError;
  }

  initialize(error: string, errorCode: string): ApplicationErrorMock {
    this.applicationError = new ApplicationError(error, errorCode);
    return this;
  }
}
