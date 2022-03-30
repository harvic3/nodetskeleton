export class TypeParser {
  static cast<T>(value: any): T {
    return value as unknown as T;
  }
}
