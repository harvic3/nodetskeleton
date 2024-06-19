import { Nulldefined } from "../../../../../domain/shared/types/Nulldefined.type";
import { SecuritySchemes } from "./IApiDocGenerator";
import { SchemasSecurityStore } from "./SchemasSecurityStore";
import { SchemasStore } from "./SchemasStore";
import { IResult } from "result-tsk";

export enum PropTypeEnum {
  STRING = "string",
  NUMBER = "number",
  BOOLEAN = "boolean",
  OBJECT = "object",
  ARRAY = "array",
  DATE = "date",
  NULL = "null",
  UNDEFINED = "undefined",
  PRIMITIVE = "primitive",
}

export enum PropFormatEnum {
  INT_64 = "int64",
  INT_32 = "int32",
  FLOAT = "float",
  DATE_TIME = "date-time",
  DATE = "date",
  TIME = "time",
  EMAIL = "email",
  URI = "uri",
  UUID = "uuid",
  PASSWORD = "password",
  TEXT = "text",
}

export type ClassProperty = {
  type: PropTypeEnum;
  format?: PropFormatEnum;
  nullable?: boolean;
  readonly?: boolean;
  required?: boolean;
  items?: { type: PropTypeEnum };
  $ref?: string;
};

type ResultWrapper = Pick<IResult, "success" | "message" | "statusCode" | "error">;

export class ResultDescriber {
  readonly name: string = "Result";
  readonly type: PropTypeEnum.OBJECT;
  readonly properties: Record<keyof ResultWrapper, ClassProperty> = {
    message: {
      type: PropTypeEnum.STRING,
      format: PropFormatEnum.TEXT,
      nullable: false,
      readonly: true,
    },
    error: {
      type: PropTypeEnum.STRING,
      format: PropFormatEnum.TEXT,
      nullable: false,
      readonly: true,
    },
    statusCode: {
      type: PropTypeEnum.STRING,
      format: PropFormatEnum.TEXT,
      nullable: false,
      readonly: true,
    },
    success: {
      type: PropTypeEnum.BOOLEAN,
      format: PropFormatEnum.TEXT,
      nullable: false,
      readonly: true,
    },
  };
  readonly schema: {
    name: string;
    type: PropTypeEnum;
    properties: Record<keyof ResultWrapper, ClassProperty>;
  };

  constructor(obj: {
    type: PropTypeEnum.OBJECT;
    props?: Record<keyof ResultWrapper, ClassProperty>;
  }) {
    this.type = obj.type;
    if (obj.props?.message) this.properties.message = obj.props.message;
    if (obj.props?.error) this.properties.error = obj.props.error;
    if (obj.props?.statusCode) this.properties.statusCode = obj.props.statusCode;
    if (obj.props?.success) this.properties.success = obj.props.success;
    this.schema = {
      name: "Result",
      type: PropTypeEnum.OBJECT,
      properties: {
        message: this.properties.message,
        statusCode: this.properties.statusCode,
        error: this.properties.error,
        success: this.properties.success,
      },
    };
    SchemasStore.add(this.schema.name, {
      type: this.schema.type,
      properties: this.schema.properties,
    });
  }
}

export class ResultTDescriber<T> {
  name: string;
  readonly type: PropTypeEnum.OBJECT;
  readonly properties: Record<keyof ResultWrapper, ClassProperty> & {
    data: TypeDescriber<T> | Nulldefined;
  } = {
    message: {
      type: PropTypeEnum.STRING,
      format: PropFormatEnum.TEXT,
      nullable: false,
      readonly: true,
    },
    error: {
      type: PropTypeEnum.STRING,
      format: PropFormatEnum.TEXT,
      nullable: false,
      readonly: true,
    },
    statusCode: {
      type: PropTypeEnum.STRING,
      format: PropFormatEnum.TEXT,
      nullable: false,
      readonly: true,
    },
    success: {
      type: PropTypeEnum.BOOLEAN,
      format: PropFormatEnum.TEXT,
      nullable: false,
      readonly: true,
    },
    data: null,
  };
  readonly schema: {
    name: string;
    type: PropTypeEnum;
    properties: Record<keyof ResultWrapper, ClassProperty> & {
      data:
        | { $ref: string }
        | { type: PropTypeEnum.OBJECT | PropTypeEnum.ARRAY; items: { $ref: string } };
    };
  };

  constructor(obj: {
    name: string;
    type: PropTypeEnum.OBJECT;
    props: Record<keyof ResultWrapper, ClassProperty> & {
      data: TypeDescriber<T>;
    };
  }) {
    this.name = obj.name;
    this.type = obj.type;
    if (obj.props?.message) this.properties.message = obj.props.message;
    if (obj.props?.error) this.properties.error = obj.props.error;
    if (obj.props?.statusCode) this.properties.statusCode = obj.props.statusCode;
    if (obj.props?.success) this.properties.success = obj.props.success;
    const reference = "#/components/schemas/" + obj.props.data.schema.name;
    this.schema = {
      name:
        obj.props.data.type === PropTypeEnum.ARRAY
          ? `ResultT${this.name}Array`
          : `ResultT${this.name}`,
      type: PropTypeEnum.OBJECT,
      properties: {
        message: this.properties.message,
        statusCode: this.properties.statusCode,
        error: this.properties.error,
        success: this.properties.success,
        data:
          obj.props.data.type === PropTypeEnum.ARRAY
            ? { type: PropTypeEnum.ARRAY, items: { $ref: reference } }
            : { $ref: reference },
      },
    };
    SchemasStore.add(this.schema.name, {
      type: this.schema.type,
      properties: this.schema.properties,
    });
  }
}

type Primitive =
  | PropTypeEnum.STRING
  | PropTypeEnum.NUMBER
  | PropTypeEnum.BOOLEAN
  | PropTypeEnum.NULL
  | PropTypeEnum.UNDEFINED;
type PrimitiveDefinition = { primitive: Primitive; format?: PropFormatEnum };

export class TypeDescriber<T> {
  readonly type: PropTypeEnum.OBJECT | PropTypeEnum.ARRAY | PropTypeEnum.PRIMITIVE;
  readonly properties: Record<keyof T, ClassProperty | TypeDescriber<any>> | PrimitiveDefinition;
  readonly schema: {
    name: string;
    type: PropTypeEnum;
    required?: string[];
    properties: Record<string, ClassProperty> | { type: PropTypeEnum };
  };

  constructor(obj: {
    name: string;
    type: PropTypeEnum.OBJECT | PropTypeEnum.ARRAY | PropTypeEnum.PRIMITIVE;
    props: Record<keyof T, ClassProperty | TypeDescriber<any>> | PrimitiveDefinition;
  }) {
    this.type = obj.type;
    this.properties = obj.props;
    const props: Record<string, ClassProperty> = {};
    Object.entries(obj.props).forEach(([key, value]) => {
      props[key] = value as ClassProperty;
    });
    this.schema = {
      name: obj.name,
      type: obj.type,
      required: [],
      properties: {},
    };

    if (this.type === PropTypeEnum.PRIMITIVE) {
      this.type = (this.properties as PrimitiveDefinition).primitive as any;
      return;
    }

    if (!Object.keys(props).length) return;

    const schemaType: Record<string, ClassProperty> = {};
    Object.keys(props).forEach((key) => {
      if (props[key].type) {
        schemaType[key] = {
          type: props[key].type,
          format: props[key].format,
          nullable: props[key].nullable,
          readonly: props[key].readonly,
        };
        if (props[key].required) {
          this.schema.required?.push(key);
        }
      }
    });

    this.schema.properties = schemaType;

    SchemasStore.add(this.schema.name, {
      type: this.schema.type,
      properties: this.schema.properties,
      required: this.schema.required,
    });
  }
}

export class RefTypeDescriber {
  readonly type: PropTypeEnum.OBJECT | PropTypeEnum.ARRAY;
  readonly schema: {
    name: string;
    definition: { $ref?: string } | { type: PropTypeEnum.ARRAY; items?: { $ref: string } };
  };

  constructor(obj: { type: PropTypeEnum.OBJECT | PropTypeEnum.ARRAY; name: string }) {
    this.type = obj.type;
    this.schema = {
      name: obj.name,
      definition: {},
    };

    if (this.type === PropTypeEnum.ARRAY) {
      this.schema = {
        name: obj.name,
        definition: {
          type: PropTypeEnum.ARRAY,
          items: { $ref: "#/components/schemas/" + obj.name },
        },
      };
    } else {
      this.schema = {
        name: obj.name,
        definition: { $ref: "#/components/schemas/" + obj.name },
      };
    }
  }
}

export class SecuritySchemesDescriber {
  [key: string]: SecuritySchemes;

  constructor(key: string, securitySchemes: SecuritySchemes) {
    this[key] = securitySchemes;
    SchemasSecurityStore.add(key, securitySchemes);
  }
}
