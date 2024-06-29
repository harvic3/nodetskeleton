import { Nulldefined } from "../types/Nulldefined.type";
import { StringUtil } from "./StringUtil";

export class DefaultValue {
  static evaluateAndGet<T>(
    value: T | Nulldefined | string,
    defaultValue: T,
    valuesIgnore: any[] = [],
  ): T {
    const isValue =
      !valuesIgnore.includes(value) &&
      value !== null &&
      value !== undefined &&
      value !== StringUtil.EMPTY &&
      !Number.isNaN(value);
    return (isValue ? value : defaultValue) as T;
  }
}
