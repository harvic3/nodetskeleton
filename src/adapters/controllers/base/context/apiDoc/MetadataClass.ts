import { ClassProperty, PropTypeEnum } from "./TypeDescriber";
import "reflect-metadata";

export class MetadataClass<T> {
  [key: string]: any;

  constructor(props: Record<keyof T, PropTypeEnum | ClassProperty | { $ref: string }>) {
    const keys = Object.keys(props) as (keyof T)[];
    for (const key of keys) {
      let metadata: any = props[key];
      if (typeof metadata === "string") {
        metadata = {
          type: metadata,
          nullable: false,
        };
        this[key as string] = metadata;
      } else if ((props[key] as { $ref: string }).$ref) {
        this[key as string] = metadata;
      } else {
        metadata = {
          ...metadata,
          type: metadata.type,
          nullable: metadata.nullable ?? false,
        };
        this[key as string] = (metadata as ClassProperty).type;
      }
      Reflect.defineMetadata("design:type", metadata, this, key as string);
    }
  }

  static getPropMetadata<T extends object>(instance: T, key: string): ClassProperty {
    return Reflect.getMetadata("design:type", instance, key);
  }
}
