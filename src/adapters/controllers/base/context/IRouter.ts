import { RequestHandler } from "../Base.controller";
import { HttpMethodEnum } from "./HttpMethod.enum";

export interface IRouter {
  (): IRouter;
  [HttpMethodEnum.GET](path: string, ...handlers: RequestHandler[]): IRouter;
  [HttpMethodEnum.POST](path: string, ...handlers: RequestHandler[]): IRouter;
  [HttpMethodEnum.PUT](path: string, ...handlers: RequestHandler[]): IRouter;
  [HttpMethodEnum.DELETE](path: string, ...handlers: RequestHandler[]): IRouter;
  [HttpMethodEnum.PATCH](path: string, ...handlers: RequestHandler[]): IRouter;
  [HttpMethodEnum.OPTIONS](path: string, ...handlers: RequestHandler[]): IRouter;
  [HttpMethodEnum.HEAD](path: string, ...handlers: RequestHandler[]): IRouter;
}
