import config from "../../../infraestructure/config/index";
import { IResult } from "./Result.interface";

export default class Result<T> implements IResult<T> {
  data: T;
  statusCode: number;
  success: boolean;
  message: string;
  public constructor() {
    this.statusCode = config.params.defaultError.code;
    this.success = false;
  }
  SetStatusCode(statusCode: number): void {
    this.statusCode = statusCode;
  }
  Successful(): void;
  Successful(message: string, statusCode?: number): void;
  Successful(message?: string, statusCode?: number) {
    if (message != null) this.message = message;
    statusCode != null
      ? (this.statusCode = statusCode)
      : (this.statusCode = 200);
    this.success = true;
  }
  SetMessage(message: string): void {
    this.message = message;
  }
  SetError(message: string, statusCode?: number): void {
    if (statusCode != null) this.statusCode = statusCode;
    this.message = message;
  }
  SetData(data: T): void {
    this.data = data;
  }
  SetSuccessful(data: T, message?: string): void;
  SetSuccessful(data: T, message: string, statusCode?: number): void;
  SetSuccessful(data: T, message?: string, statusCode?: number) {
    if (message != null) this.message = message;
    statusCode != null
      ? (this.statusCode = statusCode)
      : (this.statusCode = 200);
    this.data = data;
    this.success = true;
  }
}
