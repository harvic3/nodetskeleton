export class BooleanUtil {
  static NOT_VERIFIED = false;

  static areEqual<T>(reference: T, value: T): boolean {
    return reference === value;
  }

  static areDifferent<T>(reference: T, value: T): boolean {
    return reference !== value;
  }

  static isBoolean(value: unknown): boolean {
    return Boolean(value);
  }
}
