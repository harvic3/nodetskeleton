export class TypeParser {
  static parse<T>(value: any): T {
    return value as unknown as T;
  }
}
