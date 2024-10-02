import { RequestHandler, HttpStatusEnum } from "../../Base.controller";
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

export type UrlParamDescriber = {
  name: string;
  in: ParameterIn;
  description: string;
  required: boolean;
  deprecated: boolean;
  allowEmptyValue: boolean;
};

export type SecuritySchemeType = "http" | "apiKey" | "oauth2" | "openIdConnect" | "mutualTLS";

type BaseSecurityScheme = {
  type: SecuritySchemeType;
  description: string;
};

/**
 * name: apiKey name
 */
type ApiKeySecurityScheme = {
  type: "apiKey";
  name: string;
  scheme: string;
  in: "query" | "header" | "cookie";
  bearerFormat: string;
} & BaseSecurityScheme;

type HttpSecurityScheme = {
  type: "http";
  scheme: "bearer";
  bearerFormat: "bearer" | "JWT";
} & BaseSecurityScheme;

type OAuth2SecurityScheme = {
  type: "oauth2";
  flows: {
    implicit?: {
      authorizationUrl: string;
      scopes: Record<string, string>;
    };
    password?: {
      tokenUrl: string;
      scopes: Record<string, string>;
    };
    clientCredentials?: {
      tokenUrl: string;
      scopes: Record<string, string>;
    };
    authorizationCode?: {
      authorizationUrl: string;
      tokenUrl: string;
      scopes: Record<string, string>;
    };
  };
} & BaseSecurityScheme;

type OpenIdSecurityScheme = {
  type: "openIdConnect";
  description: string;
  openIdConnectUrl: string;
};

export type SecurityScheme =
  | ApiKeySecurityScheme
  | HttpSecurityScheme
  | OAuth2SecurityScheme
  | OpenIdSecurityScheme;

export type ApiDoc = {
  contentType: HttpContentTypeEnum;
  requireAuth: boolean;
  schema: ResultDescriber | ResultTDescriber<any> | TypeDescriber<any> | RefTypeDescriber;
  requestBody?: {
    required: boolean;
    contentType: HttpContentTypeEnum;
    description: string;
    schema: TypeDescriber<any> | RefTypeDescriber;
  };
  parameters?: UrlParamDescriber[];
  securitySchemes?: Record<string, SecurityScheme>;
};

export type RouteType = {
  method: HttpMethodEnum;
  path: string;
  handlers: RequestHandler[];
  produces: {
    applicationStatus: string;
    httpStatus: HttpStatusEnum;
  }[];
  description?: string;
  apiDoc?: ApiDoc;
  security?: Record<string, any[]>;
};

export interface IApiDocGenerator {
  createRouteDoc(route: Omit<RouteType, "handlers">): void;
}
