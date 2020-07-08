import fetch, { BodyInit as BodyType, Headers, Request, RequestInit, Response } from "node-fetch";
import TResponse from "./TResponse";
import resources from "../locals/index";
import { Options } from "./Options";
import { ApplicationError } from "../error/ApplicationError";
export { BodyInit as BodyType, Headers } from "node-fetch";

const serialization = {
  json: "json",
  string: "string",
  buffer: "buffer",
  arrayBuffer: "arrayBuffer",
};

class HttpClient {
  Method = {
    GET: "GET",
    POST: "POST",
    PUT: "PUT",
    DEL: "DELETE",
    PATCH: "PATCH",
    HEAD: "HEAD",
  };
  SerializationMethod = serialization;
  async SendAsync<T>(
    url: string,
    method = this.Method.GET,
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
    const request = BuildRequest(url, method, body, headers, options);
    const result = new TResponse<T>();
    try {
      const response = await fetch(url, request);
      if (response.ok) {
        result.SetResponse(await ProcessResponseData<T>(response, serializationMethod));
      } else {
        result.SetErrorMessage(response.statusText);
      }
      result.SetStatusCode(response.status);
    } catch (error) {
      result.SetErrorMessage(error.message);
      result.SetStatusCode(error.code || null);
      result.SetError(error);
    }
    return result;
  }
}

function BuildRequest(
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
  let data: T | string | Buffer | ArrayBuffer | PromiseLike<T>;
  try {
    switch (serializationMethod) {
      case serialization.buffer:
        data = await response.buffer();
        break;
      case serialization.arrayBuffer:
        data = await response.arrayBuffer();
        break;
      case serialization.string:
        data = await response.text();
        break;
      default:
        data = await response.json();
        break;
    }
  } catch (error) {
    throw new ApplicationError(
      resources.Get(resources.keys.PROCESSING_DATA_CLIENT_ERROR),
      500,
      JSON.stringify(error),
    );
  }
  return data;
}

const instance = new HttpClient();

export default instance;
