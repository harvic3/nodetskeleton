import { Nulldefined } from "../types/Nulldefined.type";
import { StringUtil } from "./StringUtil";

type OutputType = object | string | number | boolean;

export class DefaultValue {
  static evaluateAndGet<T extends OutputType>(
    value: T | Nulldefined,
    defaultValue: T,
    valuesIgnore: OutputType[] = [],
  ): T {
    const ignoreSet = new Set(valuesIgnore);
    const hasValue =
      !ignoreSet.has(value as T) &&
      value !== null &&
      value !== undefined &&
      value !== StringUtil.EMPTY &&
      !Number.isNaN(value);
    return hasValue ? value : defaultValue;
  }
}
