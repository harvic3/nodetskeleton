import fetch, { BodyInit as BodyType, Headers, Request, RequestInit, Response } from "node-fetch";
import TResponse from "./TResponse";
import resources, { resourceKeys } from "../../application/shared/locals/index";
import * as applicationStatusCodes from "../../application/shared/status/applicationStatusCodes.json";
import { Options } from "./Options";
import { ApplicationError } from "../../application/shared/errors/ApplicationError";
export { BodyInit as BodyType, Headers } from "node-fetch";

const serialization = {
  json: "json",
  string: "string",
  buffer: "buffer",
  arrayBuffer: "arrayBuffer",
};

class HttpClient {
  Methods = {
    GET: "GET",
    POST: "POST",
    PUT: "PUT",
    DEL: "DELETE",
    PATCH: "PATCH",
    HEAD: "HEAD",
  };
  SerializationMethod = serialization;
  async send<T>(
    url: string,
    method = this.Methods.GET,
    {
      body,
      headers,
      options,
      serializationMethod = this.SerializationMethod.json,
    }: {
      body?: BodyType;
      headers?: Headers;
      options?: Options;
      serializationMethod?: string;
    },
  ): Promise<TResponse<T>> {
    const request = buildRequest(url, method, body, headers, options);
    const result = new TResponse<T>();
    try {
      const response = await fetch(url, request);
      if (response.ok) {
        result.setResponse(await ProcessResponseData<T>(response, serializationMethod));
      } else {
        result.setErrorMessage(response.statusText);
      }
      result.setStatusCode(response.status);
    } catch (error) {
      result.setErrorMessage(error.message);
      result.setStatusCode(error.code || null);
      result.setError(error);
    }
    return result;
  }
}

function buildRequest(
  url: string,
  method: string,
  body?: BodyType,
  headers?: Headers,
  options?: RequestInit,
): Request {
  if (!options) {
    options = new Options();
  }
  options.method = method;
  if (body) {
    options.body = body;
  }
  if (headers) {
    options.headers = headers;
  }
  const request = new Request(url, options);
  const optionsKey = Object.keys(options);
  optionsKey.forEach((key) => {
    if (key !== "method" && key !== "body" && key !== "headers") {
      request[key] = options[key];
    }
  });
  return request;
}

async function ProcessResponseData<T>(
  response: Response,
  serializationMethod: string,
): Promise<T | string | Buffer | ArrayBuffer> {
  try {
    switch (serializationMethod) {
      case serialization.buffer:
        return await response.buffer();
      case serialization.arrayBuffer:
        return await response.arrayBuffer();
      case serialization.string:
        return await response.text();
      default:
        return await response.json();
    }
  } catch (error) {
    throw new ApplicationError(
      resources.get(resourceKeys.PROCESSING_DATA_CLIENT_ERROR),
      error?.code || applicationStatusCodes.INTERNAL_SERVER_ERROR,
      JSON.stringify(error),
    );
  }
}

const instance = new HttpClient();

export default instance;
