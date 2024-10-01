import "reflect-metadata";

export class MetadataClass<T> {
  [key: string]: any;

  constructor(props: Record<keyof T, any>) {
    for (const key in props) {
      this[key] = props[key];
      Reflect.defineMetadata("design:type", props[key], this, key);
    }
  }

  static getMetadata<T extends object>(instance: T, key: string): any {
    return Reflect.getMetadata("design:type", instance, key);
  }
}
