import { ResultDescriber, ResultTDescriber, TypeDescriber } from "./TypeDescriber";
import { HttpContentTypeEnum } from "../HttpContentType.enum";
import { EntryPointHandler, HttpStatusEnum } from "../../Base.controller";
import { HttpMethodEnum } from "../HttpMethod.enum";

export type ApiDoc = {
  description: string;
  contentType: HttpContentTypeEnum;
  requireAuth: boolean;
  // request: TypeDescriber<any>;
  schema: ResultDescriber | ResultTDescriber<any>;
};

export type RouteType = {
  method: HttpMethodEnum;
  path: string;
  handlers: EntryPointHandler[];
  produces: {
    applicationStatus: string;
    httpStatus: HttpStatusEnum;
  }[];
  description: string;
  apiDoc?: ApiDoc;
};

export interface IApiDocGenerator {
  addRoute(route: Omit<RouteType, "handlers">): void;
  setServer(url: string, description: "Local server"): void;
}
