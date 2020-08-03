import { ResultDto } from "./ResultDto";

export interface IResult {
  statusCode: number;
  success: boolean;
  message: string;
  error: string;
  SetStatusCode(statusCode: number, success: boolean): void;
  SetMessage(message: string, statusCode: number): void;
  SetError(error: string, statusCode: number): void;
  ToResultDto(): ResultDto;
}

export type IBaseResult = Omit<IResult, "ToResultDto">;
