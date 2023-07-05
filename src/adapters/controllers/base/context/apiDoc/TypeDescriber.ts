import { Nulldefined } from "../../../../../domain/shared/types/Nulldefined.type";
import { IResult, IResultT } from "result-tsk";
import { SchemasStore } from "./SchemasStore";

export enum PropTypeEnum {
  STRING = "string",
  NUMBER = "number",
  BOOLEAN = "boolean",
  OBJECT = "object",
  ARRAY = "array",
  DATE = "date",
  NULL = "null",
  UNDEFINED = "undefined",
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
type ResultTWrapper<T> = Pick<IResultT<T>, "success" | "message" | "statusCode" | "error" | "data">;

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

export class TypeDescriber<T> {
  readonly type: PropTypeEnum.OBJECT | PropTypeEnum.ARRAY;
  readonly properties: Record<keyof T, ClassProperty | TypeDescriber<any>>;
  readonly schema: { name: string; definition: Record<string, string> | Record<string, string>[] };

  constructor(obj: {
    name: string;
    type: PropTypeEnum.OBJECT | PropTypeEnum.ARRAY;
    props: Record<keyof T, ClassProperty | TypeDescriber<any>>;
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
    if (!Object.keys(props).length) return;

    const schemaType: Record<string, string> = {};
    Object.keys(props).forEach((key) => {
      if ((props[key] as ClassProperty).type) {
        schemaType[key] = (props[key] as ClassProperty).type;
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
