import { BooleanUtil } from "../../domain/shared/utils/BooleanUtil";
import { Headers } from "node-fetch";

type Response<T> = T | string | Buffer | ArrayBuffer | PromiseLike<T> | unknown;

export default class TResponse<R, E> {
  response: Response<R | E> | undefined;
  success = BooleanUtil.TRUE;
  statusCode: number | undefined;
  message: string | undefined;
  error: Error | undefined;
  headers: Headers | undefined;

  setResponse(data: Response<R>): void {
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
    this.success = BooleanUtil.FALSE;
  }

  setError(error: Error): void {
    this.error = error;
    this.success = BooleanUtil.FALSE;
  }

  setResponseHeaders(headers: Headers): void {
    this.headers = headers;
  }
}
