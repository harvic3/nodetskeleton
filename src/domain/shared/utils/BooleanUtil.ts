export class BooleanUtil {
  static YES = true;
  static NOT = false;
  static NOT_VERIFIED = false;
  static SUCCESS = true;
  static FAILED = false;

  static isBoolean(value: any): boolean {
    return Boolean(value);
  }
}
