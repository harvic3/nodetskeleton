export default class TResponse<T> {
  response: T;
  success = true;
  statusCode: number;
  message: string;
  error: any;
  SetResponse(data: any) {
    this.response = data;
  }
  SetStatusCode(code: number) {
    this.statusCode = code;
  }
  SetErrorMessage(message: string) {
    this.message = message;
    this.success = false;
  }
  SetError(data: any) {
    this.error = data;
    this.success = false;
  }
}