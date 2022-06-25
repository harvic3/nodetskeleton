export class BooleanUtil {
  static YES = true;
  static NO = false;
  static NOT_VERIFIED = false;
  static SUCCESS = true;
  static FAILED = false;

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
