import { TypeParser } from "./TypeParser";

export class PropertyAllocatorUtil {
  static assign<O, T>(origin: O, target: T, propertyName: string): void {
    if (!Reflect.has(TypeParser.cast<object>(origin), propertyName)) return;

    Reflect.set(
      TypeParser.cast<object>(target),
      propertyName,
      Reflect.get(TypeParser.cast<object>(origin), propertyName),
    );
  }
}
