import { IResultT } from "result-tsk";

type NON_APPLICABLE = "N/A";

type ClassProperty = {
  propType: string;
  description: string;
  required: boolean;
};

type ResClassProperty = Pick<ClassProperty, "propType" | "description"> | NON_APPLICABLE;
type ReqClassProperty =
  | Pick<ClassProperty, "propType" | "description" | "required">
  | NON_APPLICABLE;

type ResultWrapper<T> = Pick<IResultT<T>, "success" | "message" | "statusCode" | "error" | "data">;

export class ResultDescriber<T> {
  readonly type: "object";
  readonly props: Record<keyof T & ResultWrapper<T>, ResClassProperty | ResultDescriber<any>>;

  constructor(obj: {
    type: "object";
    props: Record<keyof T & ResultWrapper<T>, ResClassProperty | ResultDescriber<any>>;
  }) {
    this.type = obj.type;
    this.props = obj.props;
  }
}

export class TypeDescriber<T> {
  readonly type: "object" | "array";
  readonly props: Record<keyof T, ReqClassProperty | ResClassProperty | TypeDescriber<any>>;

  constructor(obj: {
    type: "object" | "array";
    props: Record<keyof T, ReqClassProperty | ResClassProperty | TypeDescriber<any>>;
  }) {
    this.type = obj.type;
    this.props = obj.props;
  }
}
