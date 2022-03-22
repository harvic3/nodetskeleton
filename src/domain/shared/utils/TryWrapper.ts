import { BooleanUtil } from "./BooleanUtil";
import { TypeParser } from "./TypeParser";

export type TryResult<T> = { success: boolean; value?: T; error?: Error };

export class TryWrapper {
  static exec<T>(action: Function, params: any[]): TryResult<T> {
    try {
      return { value: action(...params) as T, success: BooleanUtil.TRUE, error: undefined };
    } catch (error) {
      return {
        value: undefined,
        success: BooleanUtil.FALSE,
        error: TypeParser.parse<Error>(error),
      };
    }
  }

  static async syncExec<T>(promise: Promise<T>): Promise<TryResult<T>> {
    try {
      return { value: await promise, success: BooleanUtil.TRUE, error: undefined };
    } catch (error) {
      return {
        value: undefined,
        success: BooleanUtil.FALSE,
        error: TypeParser.parse<Error>(error),
      };
    }
  }
}
