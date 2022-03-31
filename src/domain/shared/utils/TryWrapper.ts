import { BooleanUtil } from "./BooleanUtil";
import { TypeParser } from "./TypeParser";

export type TryResult<T> = { success: boolean; value?: T; error?: Error };

export class TryWrapper {
  static exec<T>(action: Function, params: any[]): TryResult<T> {
    try {
      return { value: action(...params) as T, success: BooleanUtil.YES, error: undefined };
    } catch (error) {
      return {
        value: undefined,
        success: BooleanUtil.NOT,
        error: TypeParser.cast<Error>(error),
      };
    }
  }

  static async syncExec<T>(promise: Promise<T>): Promise<TryResult<T>> {
    try {
      return { value: await promise, success: BooleanUtil.YES, error: undefined };
    } catch (error) {
      return {
        value: undefined,
        success: BooleanUtil.NOT,
        error: TypeParser.cast<Error>(error),
      };
    }
  }
}
