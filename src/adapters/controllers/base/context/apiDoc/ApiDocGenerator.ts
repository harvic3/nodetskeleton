import { HttpContentTypeEnum, HttpMethodEnum } from "../../Base.controller";
import { ResultDescriber, TypeDescriber } from "./TypeDescriber";
import { IResult } from "result-tsk";
import { join, resolve } from "path";
import { writeFileSync } from "fs";

type ApiDocType = {
  openapi: string;
  info: {
    title: string;
    version: string;
    description: string;
  };
  servers: { url: string; description: string }[];
  paths: Record<string, any>;
  components: {
    schemas: Record<string, any>;
  };
};

const DEV = "development";

export class ApiDocGenerator {
  #apiDoc: ApiDocType = {
    openapi: "3.0.0",
    info: {
      title: "",
      version: "",
      description: "",
    },
    servers: [],
    paths: {},
    components: {
      schemas: {},
    },
  };

  constructor(
    readonly env: string,
    title = "Node Typescript Skeleton",
    version = "1.0.0",
    description = "Node Typescript Skeleton",
  ) {
    this.#apiDoc.info.title = title;
    this.#apiDoc.info.version = version;
    this.#apiDoc.info.description = description;
  }

  private saveApiDoc(): void {
    const filePath = resolve(join(__dirname, "../../../../../../api-doc.json"));
    writeFileSync(filePath, JSON.stringify(this.#apiDoc, null, 2), "utf8");
  }

  addRoute(route: {
    controllerName: string;
    method: HttpMethodEnum;
    path: string;
    contentType: HttpContentTypeEnum;
    requireAuth: boolean;
    request?: TypeDescriber<any>;
    response?: ResultDescriber<IResult>;
    description?: string;
    produces: {
      applicationStatus: string;
      httpStatus: number;
    }[];
  }): void {
    if (this.env !== DEV) return;

    const {
      controllerName,
      method,
      path,
      requireAuth,
      produces,
      request,
      response,
      contentType,
      description,
    } = route;
    if (!this.#apiDoc.paths[`/${controllerName}`]) {
      this.#apiDoc.paths[`/${controllerName}`] = {};
    }
    if (!this.#apiDoc.paths[`/${controllerName}`][`${method.toUpperCase()}:${path}`]) {
      this.#apiDoc.paths[`/${controllerName}`][`${method.toUpperCase()}:${path}`] = {
        tags: [controllerName],
        description,
        contentType,
        requireAuth,
        requestBody: request || {},
        responses: response || {},
        produces,
      };
    }
    this.#apiDoc.components.schemas[`/${controllerName}:${method.toUpperCase()}:${path}`] =
      response || {};
  }

  setServer(url: string, description: "Local server"): void {
    if (this.env !== DEV) return;

    this.#apiDoc.servers.push({
      url,
      description,
    });

    this.saveApiDoc();
  }
}
