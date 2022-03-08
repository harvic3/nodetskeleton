export class BooleanUtil {
  static TRUE = true;
  static FALSE = false;

  static isBoolean(value: any): boolean {
    return Boolean(value);
  }
}
