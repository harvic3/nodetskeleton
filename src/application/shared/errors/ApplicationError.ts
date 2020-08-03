export class ApplicationError extends Error {
  public constructor(message: string, httpStatusCode: number, errorCode?: number, stack?: string) {
    super(message);
    this.name = "ApplicationError";
    this.httpStatusCode = httpStatusCode;
    this.code = errorCode;
    this.stack = stack;
  }
  httpStatusCode: number;
  code: number;
}
