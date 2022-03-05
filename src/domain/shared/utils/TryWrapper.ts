export class TryWrapper {
  static exec<T>(action: Function, params: any[]): T | null {
    try {
      return action(...params);
    } catch (error) {
      return null;
    }
  }
}
