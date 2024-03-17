export type HttpResponseType<T> =
  | T
  | string
  | Buffer
  | ArrayBuffer
  | Blob
  | FormData
  | PromiseLike<T>;
export type Headers = Record<string, string>;

export interface ITResponse<R, E> {
  response: HttpResponseType<R | E> | undefined;
  success: boolean;
  statusCode: number | undefined;
  message?: string;
  error?: Error;
  headers?: Headers;

  setResponse(data: HttpResponseType<R>): void;
  setErrorResponse(data: E): void;
  setStatusCode(code: number): void;
  setErrorMessage(message: string): void;
  setError(error: Error): void;
  setResponseHeaders(headers: Headers): void;
}
