import { Headers } from "node-fetch";

export default class TResponse<R, E> {
  response: R | E | string | Buffer | ArrayBuffer | PromiseLike<R> | PromiseLike<E>;
  success = true;
  statusCode: number;
  message: string;
  error: Error;
  headers: Headers;

  setResponse(data: string | R | Buffer | ArrayBuffer | PromiseLike<R>): void {
    this.response = data;
  }

  setErrorResponse(data: E | PromiseLike<E>): void {
    this.response = data;
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
