import httpStatusDescriber from "../../../adapters/controllers/base/context/apiDoc/httpStatusDescriber";
import { SchemasStore } from "../../../adapters/controllers/base/context/apiDoc/SchemasStore";
import { HttpContentTypeEnum } from "../../../adapters/controllers/base/Base.controller";
import {
  ApiDoc,
  IApiDocGenerator,
  ParameterDescriber,
  RouteType,
} from "../../../adapters/controllers/base/context/apiDoc/IApiDocGenerator";
import { join, resolve } from "path";
import { writeFileSync } from "fs";
import {
  PropFormatEnum,
  PropTypeEnum,
} from "../../../adapters/controllers/base/context/apiDoc/TypeDescriber";

type SchemaType =
  | { type?: PropTypeEnum }
  | { $ref?: string }
  | { type?: PropTypeEnum.OBJECT | PropTypeEnum.ARRAY; items?: { $ref: string } };

type RequestBodyType = {
  description: string;
  content: Record<string, { schema: { $ref: string } }>;
};

type OpenApiType = {
  openapi: string;
  info: {
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
    };
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
                schema: SchemaType;
              }
            >;
          }
        >;
        requestBody: RequestBodyType;
        parameters: ParameterDescriber[];
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
    openapi: "3.0.3",
    info: {
      title: "",
      version: "",
      description: "",
      contact: {
        name: "",
        url: "",
        email: "",
      },
      license: {
        name: "MIT",
      },
    },
    servers: [],
    paths: {},
    components: {
      schemas: {},
    },
  };

  constructor(
    readonly env: string,
    info: {
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
      };
    },
  ) {
    this.apiDoc.info.title = info.title;
    this.apiDoc.info.version = info.version;
    this.apiDoc.info.description = info.description;
    this.apiDoc.info.contact = info.contact;
    this.apiDoc.info.license = info.license;
  }

  private saveApiDoc(): void {
    const filePath = resolve(join(__dirname, "../../../../openapi.json"));
    writeFileSync(filePath, JSON.stringify(this.apiDoc, null, 2), "utf8");
  }

  private setSchemas(schemas: Record<string, any>): void {
    this.apiDoc.components.schemas = schemas;
  }

  private buildParameters(
    path: string,
    parameters: ParameterDescriber[],
  ): ParameterDescriber[] | [] {
    if (!parameters.length) return [];

    const parameterNamesInPath = path.match(/(?<=\/:)\w+/g);
    if (parameterNamesInPath?.length) {
      const everyParameterInPathIsInParameters = parameterNamesInPath.every((parameterName) =>
        parameters.find((parameter) => parameter.name === parameterName),
      );
      if (!everyParameterInPathIsInParameters) {
        console.warn(
          `Path ${path} has parameters in path that are not defined in parameters array.`,
        );
      }
    }

    return parameters;
  }

  private buildSchema(schema: ApiDoc["schema"]): SchemaType {
    const schemaToSet: {
      type?: PropTypeEnum;
      items?: { type: PropTypeEnum.OBJECT | PropTypeEnum.ARRAY; $ref: string };
      $ref?: string;
    } = {
      type: PropTypeEnum.OBJECT,
      items: { type: PropTypeEnum.OBJECT, $ref: "" },
      $ref: "",
    };

    if (schema.type === PropTypeEnum.ARRAY) {
      schemaToSet.items = {
        type: schema.type,
        $ref: `#/components/schemas/${schema.schema.name}`,
      };
      delete schemaToSet.type;
      delete schemaToSet.$ref;
    } else if (schema.type === PropTypeEnum.OBJECT) {
      schemaToSet.$ref = `#/components/schemas/${schema.schema.name}`;
      delete schemaToSet.type;
      delete schemaToSet.items;
    } else {
      schemaToSet.type = schema.type;
      delete schemaToSet.items;
      delete schemaToSet.$ref;
    }

    return schemaToSet;
  }

  private buildRequestBody(requestBody: ApiDoc["requestBody"]): RequestBodyType {
    return {
      description: requestBody?.description as string,
      content: {
        [requestBody?.contentType as HttpContentTypeEnum]: {
          schema: { $ref: `#/components/schemas/${requestBody?.schema.schema.name}` },
        },
      },
    };
  }

  createRouteDoc(route: Omit<RouteType, "handlers">): void {
    if (this.env !== DEV) return;

    const { path, produces, method, description, apiDoc } = route;
    if (!apiDoc) return;

    const { contentType, schema, requestBody, parameters } = apiDoc;

    if (!this.apiDoc.paths[path]) {
      this.apiDoc.paths[path] = {};
    }

    if (!this.apiDoc.paths[path][method]) {
      this.apiDoc.paths[path][method] = { description: description } as any;
      this.apiDoc.paths[path][method].responses = {};
      if (requestBody) this.apiDoc.paths[path][method].requestBody = {} as any;
      if (parameters) this.apiDoc.paths[path][method].parameters = [];
    }

    produces.forEach(({ httpStatus }) => {
      this.apiDoc.paths[path][method].responses[httpStatus.toString()] = {
        description: httpStatusDescriber[httpStatus],
        content: {
          [contentType]: {
            schema: this.buildSchema(schema),
          },
        },
      };
      if (requestBody) {
        this.apiDoc.paths[path][method].requestBody = this.buildRequestBody(requestBody);
      }
      if (parameters) {
        this.apiDoc.paths[path][method].parameters = this.buildParameters(path, parameters);
      }
    });
  }

  setServer(url: string, description: "Local server"): void {
    if (this.env !== DEV || !Object.keys(this.apiDoc.paths).length) {
      SchemasStore.dispose();
      return;
    }

    this.apiDoc.servers.push({
      url,
      description,
    });

    this.setSchemas(SchemasStore.get());
    this.saveApiDoc();
    SchemasStore.dispose();
  }
}
