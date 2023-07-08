import { EntryPointHandler } from "../Base.controller";
import { HttpMethodEnum } from "./HttpMethod.enum";

export interface IRouter {
  (): IRouter;
  [HttpMethodEnum.GET](path: string, ...handlers: EntryPointHandler[]): IRouter;
  [HttpMethodEnum.POST](path: string, ...handlers: EntryPointHandler[]): IRouter;
  [HttpMethodEnum.PUT](path: string, ...handlers: EntryPointHandler[]): IRouter;
  [HttpMethodEnum.DELETE](path: string, ...handlers: EntryPointHandler[]): IRouter;
  [HttpMethodEnum.PATCH](path: string, ...handlers: EntryPointHandler[]): IRouter;
  [HttpMethodEnum.OPTIONS](path: string, ...handlers: EntryPointHandler[]): IRouter;
  [HttpMethodEnum.HEAD](path: string, ...handlers: EntryPointHandler[]): IRouter;
}
