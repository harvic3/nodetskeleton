import { SecuritySchemes } from "./IApiDocGenerator";

export class SchemasSecurityStore {
  static #store: { securitySchemes: Record<string, SecuritySchemes> } = { securitySchemes: {} };

  static add(key: string, schema: SecuritySchemes): void {
    this.#store.securitySchemes[key] = schema;
  }

  static get(): Record<string, any> {
    return this.#store.securitySchemes;
  }

  static dispose(): void {
    delete (this.#store as any).securitySchemes;
    this.#store = { securitySchemes: {} };
  }
}
