import { StringUtil } from "../../../domain/shared/utils/StringUtil";

export class ApplicationError extends Error {
  constructor(
    readonly context: string,
    readonly message: string,
    readonly errorCode: number | string,
    readonly stack?: string,
  ) {
    super(message);
    this.name = `${context.replace(/\s/g, StringUtil.EMPTY)}_${ApplicationError.name}`;
    this.errorCode = errorCode;
    this.stack = stack;
  }

  toError(): Error {
    return {
      message: `${this.message} [${this.errorCode}]`,
      name: this.name,
      stack: this.stack,
    };
  }
}
