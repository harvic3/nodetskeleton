import { EntryPointHandler, HttpStatusEnum } from "../../Base.controller";
import { HttpContentTypeEnum } from "../HttpContentType.enum";
import { HttpMethodEnum } from "../HttpMethod.enum";
import {
  RefTypeDescriber,
  ResultDescriber,
  ResultTDescriber,
  TypeDescriber,
} from "./TypeDescriber";

export enum ParameterIn {
  QUERY = "query",
  HEADER = "header",
  PATH = "path",
  COOKIE = "cookie",
}

export type ParameterDescriber = {
  name: string;
  in: ParameterIn;
  description: string;
  required: boolean;
  deprecated: boolean;
  allowEmptyValue: boolean;
};

export type ApiDoc = {
  contentType: HttpContentTypeEnum;
  requireAuth: boolean;
  schema: ResultDescriber | ResultTDescriber<any> | TypeDescriber<any> | RefTypeDescriber;
  requestBody?: {
    contentType: HttpContentTypeEnum;
    description: string;
    schema: TypeDescriber<any> | RefTypeDescriber;
  };
  parameters?: ParameterDescriber[];
};

export type RouteType = {
  method: HttpMethodEnum;
  path: string;
  handlers: EntryPointHandler[];
  produces: {
    applicationStatus: string;
    httpStatus: HttpStatusEnum;
  }[];
  description?: string;
  apiDoc?: ApiDoc;
};

export interface IApiDocGenerator {
  createRouteDoc(route: Omit<RouteType, "handlers">): void;
  setServer(url: string, description: "Local server"): void;
}
