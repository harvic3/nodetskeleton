import { Nulldefined } from "../types/Nulldefined.type";

export class DefaultValue {
  static evaluateAndGet<T>(value: T | Nulldefined, defaultValue: T): T {
    return value || defaultValue;
  }
}
