export class ApplicationError extends Error {
  public constructor(message: string, errorCode: number, stack?: string) {
    super(message);
    this.name = "ApplicationError";
    this.errorCode = errorCode;
    this.stack = stack;
  }
  httpStatusCode: number;
  errorCode: number;
}
