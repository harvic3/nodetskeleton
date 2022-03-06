import fetch, { BodyInit as BodyType, Headers, Request, RequestInit, Response } from "node-fetch";
import { ApplicationError } from "../../application/shared/errors/ApplicationError";
import resources, { resourceKeys } from "../../application/shared/locals/messages";
import httpStatus from "../../adapters/controllers/base/httpResponse/httpStatus";
import { BooleanUtil } from "../../domain/shared/utils/BooleanUtil";
export { BodyInit as BodyType, Headers } from "node-fetch";
import TResponse from "./TResponse";

type HttpResponseType<T> = T | string | ArrayBuffer | unknown;

const SERIALIZED = BooleanUtil.TRUE;
const serialization = {
  json: "json",
  string: "string",
  arrayBuffer: "arrayBuffer",
};

export class HttpClient {
  Methods = {
    GET: "GET",
    POST: "POST",
    PUT: "PUT",
    DEL: "DELETE",
    PATCH: "PATCH",
    HEAD: "HEAD",
  };
  SerializationMethod = serialization;
  async send<R, E>(
    url: string,
    {
      method = this.Methods.GET,
      body,
      headers,
      options,
      serializationMethod = this.SerializationMethod.json,
    }: {
      method?: string;
      body?: BodyType;
      headers?: Headers;
      options?: RequestInit;
      serializationMethod?: string;
    },
  ): Promise<TResponse<R, E>> {
    const request = this.buildRequest(url, method, body, headers, options);
    const result = new TResponse<R, E>();
    try {
      const response = await fetch(url, request);
      if (response.ok) {
        result.setResponse(await this.processResponseData<R>(response, serializationMethod));
      } else {
        const errorResponse = await this.processErrorResponse<E>(response);
        if (errorResponse[1] === SERIALIZED) {
          result.setErrorMessage(
            response?.statusText || resources.get(resourceKeys.UNKNOWN_RESPONSE_STATUS),
          );
          result.setErrorResponse(errorResponse[0] as E);
        } else {
          result.setErrorMessage(response.statusText);
          result.setErrorResponse(errorResponse[0] as E);
        }
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
    if (!options) options = {};
    options["method"] = method;
    if (body) options["body"] = body;
    if (headers) options["headers"] = headers;

    return new Request(url, options);
  }

  private async processErrorResponse<E>(response: Response): Promise<[E | string, boolean]> {
    let result = null;
    try {
      result = await response.text();
      return [JSON.parse(result), SERIALIZED];
    } catch (error) {
      return [result as E | string, !SERIALIZED];
    }
  }

  private async processResponseData<R>(
    response: Response,
    serializationMethod: string,
  ): Promise<HttpResponseType<R>> {
    try {
      switch (serializationMethod) {
        case serialization.arrayBuffer:
          return await response.arrayBuffer();
        case serialization.string:
          return await response.text();
        default:
          return await response.json();
      }
    } catch (error) {
      throw new ApplicationError(
        HttpClient.name,
        resources.get(resourceKeys.PROCESSING_DATA_CLIENT_ERROR),
        httpStatus.INTERNAL_SERVER_ERROR,
        JSON.stringify(error),
      );
    }
  }
}

export default new HttpClient();
