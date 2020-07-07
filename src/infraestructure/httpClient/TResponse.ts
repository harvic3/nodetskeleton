export default class TResponse<T> {
  response: T | string | Buffer | ArrayBuffer | PromiseLike<T>;
  success = true;
  statusCode: number;
  message: string;
  error: Error;
  SetResponse(data: string | T | Buffer | ArrayBuffer | PromiseLike<T>): void {
    this.response = data;
  }
  SetStatusCode(code: number): void {
    this.statusCode = code;
  }
  SetErrorMessage(message: string): void {
    this.message = message;
    this.success = false;
  }
  SetError(error: Error): void {
    this.error = error;
    this.success = false;
  }
}
