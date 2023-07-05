import httpStatusDescriber from "../../../adapters/controllers/base/context/apiDoc/httpStatusDescriber";
import { SchemasStore } from "../../../adapters/controllers/base/context/apiDoc/SchemasStore";
import {
  ApiDoc,
  IApiDocGenerator,
  RouteType,
} from "../../../adapters/controllers/base/context/apiDoc/IApiDocGenerator";
import { join, resolve } from "path";
import { writeFileSync } from "fs";
import {
  PropFormatEnum,
  PropTypeEnum,
} from "../../../adapters/controllers/base/context/apiDoc/TypeDescriber";

type OpenApiType = {
  openapi: string;
  title: string;
  version: string;
  description: string;
  contact: {
    name: string;
    url: string;
    email: string;
  };
  license: {
    name: string;
    identifier: string;
  };
  servers: { url: string; description: string }[];
  paths: Record<
    string,
    Record<
      string,
      {
        description: string;
        responses: Record<
          string,
          {
            description?: string;
            content: Record<
              string,
              {
                schema:
                  | { $ref: string }
                  | { type: PropTypeEnum.OBJECT | PropTypeEnum.ARRAY; items: { $ref: string } };
              }
            >;
          }
        >;
      }
    >
  >;
  components: {
    schemas: Record<
      string,
      { type: string; properties: { type: PropTypeEnum; format: PropFormatEnum } }
    >;
  };
};

const DEV = "development";

export class ApiDocGenerator implements IApiDocGenerator {
  apiDoc: OpenApiType = {
    openapi: "3.1.0",
    title: "",
    version: "",
    description: "",
    contact: {
      name: "TSK Support",
      url: "https://github.com/harvic3/nodetskeleton",
      email: "harvic3@protonmail.com",
    },
    license: {
      name: "MIT",
      identifier: "MIT",
    },
    servers: [],
    paths: {},
    components: {
      schemas: {},
    },
  };

  constructor(
    readonly env: string,
    title = "NodeTSkeleton API",
    version = "1.0.0",
    description = "Api documentation for NodeTSkeleton project",
  ) {
    this.apiDoc.title = title;
    this.apiDoc.version = version;
    this.apiDoc.description = description;
  }

  private saveApiDoc(): void {
    const filePath = resolve(join(__dirname, "../../../../openapi.json"));
    writeFileSync(filePath, JSON.stringify(this.apiDoc, null, 2), "utf8");
  }

  private setSchemas(schemas: Record<string, any>): void {
    this.apiDoc.components.schemas = schemas;
  }

  addRoute(route: Omit<RouteType, "handlers">): void {
    if (this.env !== DEV) return;

    const { path, produces, method, description, apiDoc } = route;
    const { contentType, schema } = apiDoc as ApiDoc;

    if (!this.apiDoc.paths[path]) {
      this.apiDoc.paths[path] = {};
    }

    if (!this.apiDoc.paths[path][method]) {
      this.apiDoc.paths[path][method] = { description: description } as any;
      this.apiDoc.paths[path][method].responses = {};
    }

    produces.forEach(({ httpStatus }) => {
      this.apiDoc.paths[path][method].responses[httpStatus.toString()] = {
        description: httpStatusDescriber[httpStatus],
        content: {
          [contentType]: {
            schema:
              schema.type === PropTypeEnum.OBJECT
                ? { $ref: `#/components/schemas/${schema.schema.name}` }
                : {
                    type: schema.type,
                    items: { $ref: `#/components/schemas/${schema.schema.name}` },
                  },
          },
        },
      };
    });
  }

  setServer(url: string, description: "Local server"): void {
    if (this.env !== DEV) return;

    this.apiDoc.servers.push({
      url,
      description,
    });

    this.setSchemas(SchemasStore.get());
    this.saveApiDoc();
    SchemasStore.dispose();
  }
}
