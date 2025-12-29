import { ApiDoc, ApiDocRouteType, SchemeDescription } from "openapi-tsk";
import { ResultDescriber, ResultTDescriber } from "./ResultDescriber";
import {
  HttpContentTypeEnum,
  ApplicationStatus,
  HttpMethodEnum,
  HttpStatusEnum,
  RequestHandler,
} from "../Base.controller";
export {
  SecuritySchemesDescriber,
  PrimitiveDefinition,
  SchemeDescription,
  IApiDocGenerator,
  RefTypeDescriber,
  ApiDocGenerator,
  PropFormatEnum,
  ClassProperty,
  TypeDescriber,
  SchemasStore,
  PropTypeEnum,
  ParameterIn,
  ApiProduce,
  Primitive,
  ApiDoc,
} from "openapi-tsk";

type SchemeDescriptionType = ResultDescriber | ResultTDescriber<any> | SchemeDescription;

export type RouteType = {
  method: HttpMethodEnum;
  path: string;
  handlers: RequestHandler[];
  produces: {
    applicationStatus: ApplicationStatus;
    httpStatus: HttpStatusEnum;
    model?: {
      contentType: HttpContentTypeEnum;
      scheme: SchemeDescriptionType;
    };
  }[];
  apiDoc?: ApiDoc;
} & Pick<ApiDocRouteType, "description" | "security" | "apiDoc">;
