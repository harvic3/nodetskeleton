import { SecurityScheme } from "./IApiDocGenerator";

export class SecuritySchemesStore {
  static #store: { securitySchemes: Record<string, SecurityScheme> } = { securitySchemes: {} };

  static add(key: string, schema: SecurityScheme): void {
    this.#store.securitySchemes[key] = schema;
  }

  static get(): Record<string, SecurityScheme> {
    return this.#store.securitySchemes;
  }

  static dispose(): void {
    delete (this.#store as any).securitySchemes;
    this.#store = { securitySchemes: {} };
  }
}
