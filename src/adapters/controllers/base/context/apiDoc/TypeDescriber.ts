import { Nulldefined } from "../../../../../domain/shared/types/Nulldefined.type";
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
}

type ClassProperty = {
  type: PropTypeEnum;
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
      nullable: false,
      readonly: true,
    },
    error: {
      type: PropTypeEnum.STRING,
      nullable: false,
      readonly: true,
    },
    statusCode: {
      type: PropTypeEnum.STRING,
      nullable: false,
      readonly: true,
    },
    success: {
      type: PropTypeEnum.BOOLEAN,
      nullable: false,
      readonly: true,
    },
  };
  readonly schema: { name: string; definition: Record<keyof ResultWrapper, PropTypeEnum> };

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
      definition: {
        message: PropTypeEnum.STRING,
        statusCode: PropTypeEnum.STRING,
        error: PropTypeEnum.STRING,
        success: PropTypeEnum.BOOLEAN,
      },
    };
    SchemasStore.add(this.schema.name, this.schema.definition);
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
      nullable: false,
      readonly: true,
    },
    error: {
      type: PropTypeEnum.STRING,
      nullable: false,
      readonly: true,
    },
    statusCode: {
      type: PropTypeEnum.STRING,
      nullable: false,
      readonly: true,
    },
    success: {
      type: PropTypeEnum.BOOLEAN,
      nullable: false,
      readonly: true,
    },
    data: null,
  };
  readonly schema: {
    name: string;
    definition: Record<keyof ResultWrapper, PropTypeEnum> & {
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
      name: `ResultT<${this.name}>`,
      definition: {
        message: PropTypeEnum.STRING,
        statusCode: PropTypeEnum.STRING,
        error: PropTypeEnum.STRING,
        success: PropTypeEnum.BOOLEAN,
        data:
          obj.props.data.type === PropTypeEnum.ARRAY
            ? { type: PropTypeEnum.ARRAY, items: { $ref: reference } }
            : { $ref: reference },
      },
    };
    SchemasStore.add(this.schema.name, this.schema.definition);
  }
}

type Primitive =
  | PropTypeEnum.STRING
  | PropTypeEnum.NUMBER
  | PropTypeEnum.BOOLEAN
  | PropTypeEnum.NULL
  | PropTypeEnum.UNDEFINED;
type PrimitiveDefinition = { primitive: Primitive };

export class TypeDescriber<T> {
  readonly type: PropTypeEnum.OBJECT | PropTypeEnum.ARRAY | PropTypeEnum.PRIMITIVE;
  readonly properties: Record<keyof T, ClassProperty | TypeDescriber<any>> | PrimitiveDefinition;
  readonly schema: { name: string; definition: Record<string, string> | Record<string, string>[] };

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
      definition: {},
    };

    if (this.type === PropTypeEnum.PRIMITIVE) {
      this.type = (this.properties as PrimitiveDefinition).primitive as any;
      this.schema.definition = { primitive: (this.properties as PrimitiveDefinition).primitive };
      SchemasStore.add(this.schema.name, this.schema.definition);
      return;
    }

    if (!Object.keys(props).length) return;

    const schemaType: Record<string, string> = {};
    Object.keys(props).forEach((key) => {
      if (props[key].type) {
        schemaType[key] = props[key].type;
      }
    });

    if (this.type === PropTypeEnum.ARRAY) {
      this.schema = {
        name: obj.name,
        definition: [schemaType],
      };
    } else {
      this.schema = {
        name: obj.name,
        definition: schemaType,
      };
    }

    SchemasStore.add(this.schema.name, this.schema.definition);
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
