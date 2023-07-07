export type Response<T> = T | string | Buffer | ArrayBuffer | PromiseLike<T> | unknown;
export type Headers = Record<string, string>;

export interface ITResponse<R, E> {
  response: Response<R | E> | undefined;
  success: boolean;
  statusCode: number | undefined;
  message: string | undefined;
  error: Error | undefined;
  headers: Headers | undefined;

  setResponse(data: Response<R>): void;
  setErrorResponse(data: E | PromiseLike<E>): void;
  setStatusCode(code: number): void;
  setErrorMessage(message: string): void;
  setError(error: Error): void;
  setResponseHeaders(headers: Headers): void;
}
