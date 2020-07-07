import * as httpm from "typed-rest-client/HttpClient";
import TResponse from "./TResponse";
import ClientHeaders from "./Headers";

export class HttpClient {
  httpClient: httpm.HttpClient;
  public constructor(clientName = "custom-client") {
    this.httpClient = new httpm.HttpClient(clientName);
  }
  Method = {
    GET: "get",
    POST: "post",
    PUT: "put",
    DELETE: "del",
    PATCH: "patch",
    HEAD: "head",
  };
  async SendAsync<T>(
    url: string,
    method = this.Method.GET,
    body?: unknown,
    headers?: ClientHeaders,
  ): Promise<TResponse<T>> {
    const result = new TResponse<T>();
    try {
      let httpResponse: httpm.HttpClientResponse;
      if (method == this.Method.GET || method == this.Method.DELETE || method == this.Method.HEAD) {
        httpResponse = await this.httpClient[method](url, headers.Keys);
      } else {
        httpResponse = await this.httpClient[method](url, JSON.stringify(body), headers.Keys);
      }
      if (httpResponse.message.statusCode == 200) {
        result.SetResponse(await ProcessResponseData(httpResponse));
      } else {
        result.SetStatusCode(httpResponse.message.statusCode);
        result.SetErrorMessage(httpResponse.message.statusMessage);
      }
    } catch (error) {
      result.SetErrorMessage(error.message);
      result.SetStatusCode(error.code || null);
      result.SetError(error);
    }
    return result;
  }
}

async function ProcessResponseData(response: httpm.HttpClientResponse): Promise<unknown> {
  const data = await response.readBody();
  try {
    return JSON.parse(data);
  } catch (error) {
    return data;
  }
}
