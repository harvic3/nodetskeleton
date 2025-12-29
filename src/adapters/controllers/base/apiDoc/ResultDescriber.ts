import { Nulldefined } from "../../../../domain/shared/types/Nulldefined.type";
import {
  PrimitiveDefinition,
  PropFormatEnum,
  ClassProperty,
  TypeDescriber,
  PropTypeEnum,
  SchemasStore,
  Primitive,
} from "./types";
import { IResult } from "result-tsk";

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

  static default(): Record<"success" | "message" | "statusCode" | "error", ClassProperty> {
    return {
      error: {
        type: PropTypeEnum.STRING,
      },
      message: {
        type: PropTypeEnum.STRING,
      },
      statusCode: {
        type: PropTypeEnum.STRING,
      },
      success: {
        type: PropTypeEnum.BOOLEAN,
      },
    };
  }

  static defaultError(): Record<"success" | "message" | "statusCode" | "error", ClassProperty> {
    return {
      error: {
        type: PropTypeEnum.STRING,
      },
      message: {
        type: PropTypeEnum.STRING,
        nullable: true,
      },
      statusCode: {
        type: PropTypeEnum.STRING,
      },
      success: {
        type: PropTypeEnum.BOOLEAN,
      },
    };
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
      | { type: Primitive }
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
    if ((obj.props.data.type as PropTypeEnum) === PropTypeEnum.UNDEFINED) {
      Reflect.deleteProperty(this?.schema?.properties, "data");
    } else if (
      [PropTypeEnum.STRING, PropTypeEnum.NUMBER, PropTypeEnum.BOOLEAN].includes(
        obj.props.data?.type as PropTypeEnum,
      )
    ) {
      this.schema.properties.data = {
        type: (obj.props.data?.properties as PrimitiveDefinition).primitive,
      };
    }

    SchemasStore.add(this.schema.name, {
      type: this.schema.type,
      properties: this.schema.properties,
    });
  }
}
