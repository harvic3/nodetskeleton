import { PropTypeEnum } from "./TypeDescriber";

export class SchemasStore {
  static #store: { schemas: Record<string, any> } = { schemas: {} };

  static add(
    key: string,
    schema: {
      type: PropTypeEnum;
      properties: any;
      required?: string[];
    },
  ): void {
    if (!schema.required?.length) delete schema.required;
    this.#store.schemas[key] = schema;
  }

  static get(): Record<string, any> {
    return this.#store.schemas;
  }

  static dispose(): void {
    delete (this.#store as any).schemas;
    this.#store = { schemas: {} };
  }
}
