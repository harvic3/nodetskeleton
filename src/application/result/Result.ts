import config from "../../infraestructure/config/index";
import { IResult } from "./Result.interface";

export default class Result implements IResult {
  statusCode: number;
  success: boolean;
  message: string;
  public constructor() {
    this.statusCode = config.params.defaultError.code;
    this.success = false;
  }
  SetMessage(message: string): void {
    this.message = message;
  }
  SetStatusCode(statusCode: number) {
    this.statusCode = statusCode;
  }
  SetError(message: string, statusCode?: number): void {
    this.message = message;
    if (statusCode != null) this.statusCode = statusCode;
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
}
