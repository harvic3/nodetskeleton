export class BooleanUtil {
  static NOT_VERIFIED = false;

  static areEqual<T>(reference: T, value: T): boolean {
    if (!reference || !value) return false;

    if (typeof reference !== typeof value) return false;

    if (Array.isArray(reference)) {
      throw new Error("Array comparison not implemented");
    }

    const type = typeof reference;
    if (type === "function") return reference.toString() === value.toString();
    if (type !== "object") return reference === value;

    const referenceKeys = Object.keys(reference);
    const valueKeys = Object.keys(value);
    if (referenceKeys.length !== valueKeys.length) return false;

    return JSON.stringify(reference) === JSON.stringify(value);
  }

  static areDifferent<T>(reference: T, value: T): boolean {
    return !this.areEqual(reference, value);
  }

  static isBoolean(value: unknown): boolean {
    return Boolean(value);
  }
}
