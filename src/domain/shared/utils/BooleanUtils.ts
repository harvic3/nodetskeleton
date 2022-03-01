export class BooleanUtils {
  static TRUE = true;
  static FALSE = false;

  static isBoolean(value: any): boolean {
    return typeof value === "boolean";
  }
}
