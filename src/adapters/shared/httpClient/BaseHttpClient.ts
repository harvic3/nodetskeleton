import { HttpMethodEnum } from "../../controllers/base/context/HttpMethod.enum";
import { SerializationTypeEnum } from "./SerializationType";
import { Headers, ITResponse } from "./ITResponse";

export type BodyType =
  | ArrayBuffer
  | ArrayBufferView
  | NodeJS.ReadableStream
  | string
  | URLSearchParams;
export type ReqArgs = {
  method: string;
  serializationMethod: SerializationTypeEnum;
  body?: BodyType;
  headers?: Headers;
  options?: RequestInit;
  timeout?: number;
};

export abstract class BaseHttpClient {
  SerializationMethod = SerializationTypeEnum;
  Methods = HttpMethodEnum;

  abstract send<ResType, ErrType>(
    url: string,
    reqArgs: ReqArgs,
  ): Promise<ITResponse<ResType, ErrType>>;
}
