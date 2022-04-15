import { ApplicationError } from "./ApplicationError";

export class Throw {
  static when(
    context: string,
    condition: boolean,
    message: string,
    errorCode: number | string,
  ): void {
    if (condition) {
      throw new ApplicationError(context, message, errorCode);
    }
  }
}
