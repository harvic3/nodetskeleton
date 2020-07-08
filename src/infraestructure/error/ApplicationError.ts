export class ApplicationError extends Error {
  public constructor(message: string, code = 500, stack?: string) {
    super(message);
    this.name = "ApplicationError";
    this.code = code;
    this.stack = stack;
  }
  code: number;
}
