import { TypeParser } from "./TypeParser";

export class ObjectPropertyUtil {
  static assign<O, T>(origin: O, target: T, propertyName: string): void {
    if (!Reflect.has(TypeParser.cast<object>(origin), propertyName)) return;

    Reflect.set(
      TypeParser.cast<object>(target),
      propertyName,
      Reflect.get(TypeParser.cast<object>(origin), propertyName),
    );
  }

  static remove<T>(target: T, propsToRemove: string[]): void {
    if (!propsToRemove.length || !target) return;

    propsToRemove.forEach((propertyName) => {
      if (Reflect.has(TypeParser.cast<object>(target), propertyName)) {
        Reflect.deleteProperty(target, propertyName);
      }
    });
  }
}
