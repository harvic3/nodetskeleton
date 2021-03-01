export default class TResponse<T> {
  response: T | string | Buffer | ArrayBuffer | PromiseLike<T>;
  success = true;
  statusCode: number;
  message: string;
  error: Error;

  setResponse(data: string | T | Buffer | ArrayBuffer | PromiseLike<T>): void {
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
}
