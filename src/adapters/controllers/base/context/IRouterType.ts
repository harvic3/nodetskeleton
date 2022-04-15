import { EntryPointHandler } from "../Base.controller";

export interface IRouterType {
  prefix(prefix: string): void;
  routes(): Map<any, {}>;
  allowedMethods(): Map<any, {}>;
  get(path: string, ...handlers: EntryPointHandler[]): IRouterType;
  post(path: string, ...handlers: EntryPointHandler[]): IRouterType;
  put(path: string, ...handlers: EntryPointHandler[]): IRouterType;
  delete(path: string, ...handlers: EntryPointHandler[]): IRouterType;
  patch(path: string, ...handlers: EntryPointHandler[]): IRouterType;
}
