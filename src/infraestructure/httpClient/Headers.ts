import { IHeaders } from "typed-rest-client/Interfaces";

export default class ClientHeaders implements IHeaders {
  public Keys: { [key: string]: string } = {};
  Add(key: string, value: string): void {
    this.Keys[key] = value;
  }
  Get(key: string): string {
    return this.Keys[key] || null;
  }
}
