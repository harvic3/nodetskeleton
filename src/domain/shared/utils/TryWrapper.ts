import { TypeParser } from "./TypeParser";

export type TryResult<T> = { success: boolean; value?: T; error?: Error };

export class TryWrapper {
  static exec<T>(action: Function, params: any[]): TryResult<T> {
    try {
      const value = action(...params) as T;
      return { value, success: true, error: undefined };
    } catch (error) {
      return {
        value: undefined,
        success: false,
        error: TypeParser.cast<Error>(error),
      };
    }
  }

  static async syncExec<T>(promise: Promise<T>): Promise<TryResult<T>> {
    try {
      const value = await promise;
      return { value, success: true, error: undefined };
    } catch (error) {
      return {
        value: undefined,
        success: false,
        error: TypeParser.cast<Error>(error),
      };
    }
  }
}
