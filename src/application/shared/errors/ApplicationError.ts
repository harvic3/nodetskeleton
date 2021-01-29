export class ApplicationError extends Error {
  public constructor(message: string, errorCode: number | string, stack?: string) {
    super(message);
    this.name = "ApplicationError";
    this.errorCode = errorCode;
    this.stack = stack;
  }
  errorCode: number | string;
}
