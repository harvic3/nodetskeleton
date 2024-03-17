import { Headers, ITResponse, HttpResponseType } from "../../adapters/shared/httpClient/ITResponse";

export class TResponse<R, E> implements ITResponse<R, E> {
  response: HttpResponseType<R | E> | undefined;
  success = false;
  statusCode: number | undefined;
  message: string | undefined;
  error: Error | undefined;
  headers: Headers | undefined;

  setResponse(data: HttpResponseType<R>): void {
    this.response = data;
    this.success = true;
  }

  setErrorResponse(data: E | PromiseLike<E>): void {
    this.response = data;
    this.success = false;
  }

  setStatusCode(code: number): void {
    this.statusCode = code;
  }

  setErrorMessage(message: string): void {
    this.message = message;
    this.success = false;
  }

  setError(error: Error): void {
    this.error = error;
    this.success = false;
  }

  setResponseHeaders(headers: Headers): void {
    this.headers = headers;
  }
}
