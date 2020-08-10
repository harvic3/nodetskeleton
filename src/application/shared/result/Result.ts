import { IResult } from "./Result.interface";
import { ResultDto } from "./ResultDto";

export class Result implements IResult {
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
  ToResultDto(): ResultDto {
    const result = new ResultDto();
    result.error = this.error;
    result.message = this.message;
    return result;
  }
}
