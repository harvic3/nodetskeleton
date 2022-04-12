export class TypeParser {
  static cast<T>(value: unknown): T {
    return value as T;
  }
}
