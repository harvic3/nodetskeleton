import fetch, { BodyInit as BodyType, Headers, Request, RequestInit, Response } from "node-fetch";
import { ApplicationError } from "../../application/shared/errors/ApplicationError";
import { ObjectPropertyUtil } from "../../domain/shared/utils/ObjectPropertyUtil";
import httpStatus from "../../adapters/controllers/base/httpResponse/httpStatus";
import { DefaultValue } from "../../domain/shared/utils/DefaultValue";
import { BooleanUtil } from "../../domain/shared/utils/BooleanUtil";
import appMessages from "../../application/shared/locals/messages";
import ArrayUtil from "../../domain/shared/utils/ArrayUtil";
import { SerializationType } from "./SerializationType";
import TResponse from "./TResponse";

type HttpResponseType<ResType> = ResType | string | ArrayBuffer | unknown;

type ReqArgs = {
  method: string;
  serializationMethod: string;
  body?: BodyType;
  headers?: Headers;
  options?: RequestInit;
};

export class HttpClient {
  #SERIALIZED = true;
  Methods = {
    GET: "GET",
    POST: "POST",
    PUT: "PUT",
    DEL: "DELETE",
    PATCH: "PATCH",
    HEAD: "HEAD",
  };
  SerializationMethod = SerializationType;
  async send<ResType, ErrType>(
    url: string,
    reqArgs: ReqArgs = {
      method: this.Methods.GET,
      body: undefined,
      headers: undefined,
      options: undefined,
      serializationMethod: SerializationType.JSON,
    },
  ): Promise<TResponse<ResType, ErrType>> {
    const request = this.buildRequest(
      url,
      reqArgs?.method,
      reqArgs.body,
      reqArgs.headers,
      reqArgs.options,
    );
    const result = new TResponse<ResType, ErrType>();
    try {
      const response = await fetch(url, request);
      if (response.ok) {
        result.setResponse(
          await this.processResponseData<ResType>(response, reqArgs.serializationMethod),
        );
      } else {
        const errorResponse = await this.processClientErrorResponse<ErrType>(response);
        this.processErrorResponse<ResType, ErrType>(errorResponse, result, response);
      }
      result.setStatusCode(response.status);
    } catch (error) {
      result.setErrorMessage((error as Error).message);
      result.setStatusCode(httpStatus.INTERNAL_SERVER_ERROR);
      result.setError(error as Error);
    }
    return result;
  }

  private buildRequest(
    url: string,
    method: string,
    body?: BodyType,
    headers?: Headers,
    options?: RequestInit,
  ): Request {
    const origin = { method, body, headers };
    if (!options) options = {};
    ObjectPropertyUtil.assign(options, origin, "method");
    ObjectPropertyUtil.assign(options, origin, "body");
    ObjectPropertyUtil.assign(options, origin, "headers");

    return new Request(url, options);
  }

  private async processClientErrorResponse<ErrType>(
    response: Response,
  ): Promise<[ErrType | string, boolean]> {
    let result = null;
    try {
      result = await response.text();
      return [JSON.parse(result), this.#SERIALIZED];
    } catch (error) {
      return [result as ErrType | string, !this.#SERIALIZED];
    }
  }

  private processErrorResponse<ResType, ErrType>(
    errorResponse: [string | ErrType, boolean],
    result: TResponse<ResType, ErrType>,
    response: Response,
  ): void {
    if (BooleanUtil.areEqual(errorResponse[ArrayUtil.INDEX_ONE], this.#SERIALIZED)) {
      result.setErrorMessage(
        DefaultValue.evaluateAndGet(
          response?.statusText,
          appMessages.get(appMessages.keys.UNKNOWN_RESPONSE_STATUS),
        ),
      );
      result.setErrorResponse(errorResponse[ArrayUtil.FIRST_INDEX] as ErrType);
    } else {
      result.setErrorMessage(response.statusText);
      result.setErrorResponse(errorResponse[ArrayUtil.FIRST_INDEX] as ErrType);
    }
  }

  private async processResponseData<ResType>(
    response: Response,
    serializationMethod: SerializationType,
  ): Promise<HttpResponseType<ResType>> {
    try {
      switch (serializationMethod) {
        case SerializationType.BUFFER:
          return await response.buffer();
        case SerializationType.ARRAY_BUFFER:
          return await response.arrayBuffer();
        case SerializationType.TEXT:
          return await response.text();
        case SerializationType.BLOB:
          return await response.blob();
        default:
          return await response.json();
      }
    } catch (error) {
      throw new ApplicationError(
        HttpClient.name,
        appMessages.get(appMessages.keys.PROCESSING_DATA_CLIENT_ERROR),
        httpStatus.INTERNAL_SERVER_ERROR,
        JSON.stringify(error),
      );
    }
  }
}

export default new HttpClient();
