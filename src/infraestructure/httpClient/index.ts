import * as httpm from "typed-rest-client/HttpClient";
import TResponse from "./TResponse";
import ClientHeaders from "./Headers";

const jsonType = "application/json";

class HttpClient {
  httpClient: httpm.HttpClient;
  public constructor() {
    this.httpClient = new httpm.HttpClient("http-client");
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
    body?: any,
    headers?: ClientHeaders,
  ): Promise<TResponse<T>> {
    const result = new TResponse<T>();
    try {
      let httpResponse: httpm.HttpClientResponse;
      if (
        method == this.Method.GET ||
        method == this.Method.DELETE ||
        method == this.Method.HEAD
      ) {
        httpResponse = await this.httpClient[method](url, headers.Keys);
      } else {
        httpResponse = await this.httpClient[method](
          url,
          JSON.stringify(body),
          headers.Keys,
        );
      }
      if (httpResponse.message.statusCode == 200) {
        if (headers.Get("Accept") === jsonType) {
          result.SetResponse(JSON.parse(await httpResponse.readBody()));
        } else {
          result.SetResponse(await httpResponse.readBody());
        }
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

export default new HttpClient();
