import { StringUtil } from "../../../domain/shared/utils/StringUtil";

export class ApplicationError extends Error {
  public constructor(context: string, message: string, errorCode: number | string, stack?: string) {
    super(message);
    this.name = `${StringUtil.cleanWhiteSpace(context)}_${ApplicationError.name}`;
    this.errorCode = errorCode;
    this.stack = stack;
  }
  errorCode: number | string;
}
