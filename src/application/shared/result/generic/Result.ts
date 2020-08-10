import { IResult } from "./Result.interface";
import { ResultDto } from "../ResultDto";

export class Result<T> implements IResult<T> {
  data: T | string;
  statusCode: number;
  success: boolean;
  message: string;
  error: string;
  SetStatusCode(statusCode: number, success: boolean): void {
    this.statusCode = statusCode;
    this.success = success;
  }
  SetMessage(message: string, statusCode: number): void {
    this.message = message;
    this.statusCode = statusCode;
    this.success = true;
  }
  SetError(error: string, statusCode: number): void {
    this.error = error;
    this.statusCode = statusCode;
    this.success = false;
  }
  SetData(data: string | T, statusCode: number): void {
    this.data = data;
    this.statusCode = statusCode;
    this.success = true;
  }
  ToResultDto(): ResultDto {
    const result = new ResultDto();
    result.error = this.error;
    result.message = this.message;
    result.data = this.data;
    return result;
  }
}
