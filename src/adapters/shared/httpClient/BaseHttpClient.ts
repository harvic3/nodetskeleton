import { HttpMethodEnum } from "../../controllers/base/context/HttpMethod.enum";
import { SerializationType } from "./SerializationType";
import { Headers, ITResponse } from "./ITResponse";

type BodyType = ArrayBuffer | ArrayBufferView | NodeJS.ReadableStream | string | URLSearchParams;
type RequestInit = {
  body?: BodyType | undefined;
  headers?: Headers | undefined;
  method?: string | undefined;
};

export type ReqArgs = {
  method: string;
  serializationMethod: string;
  body?: BodyType;
  headers?: Headers;
  options?: RequestInit;
};

export abstract class BaseHttpClient {
  SerializationMethod = SerializationType;
  Methods = HttpMethodEnum;

  abstract send<ResType, ErrType>(
    url: string,
    reqArgs: ReqArgs,
  ): Promise<ITResponse<ResType, ErrType>>;
}
