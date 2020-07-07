export class ApplicationError extends Error {
  code: number;
  public constructor(message: string, code = 500) {
    super(message);
    this.name = "ApplicationError";
    this.code = code;
  }
}
