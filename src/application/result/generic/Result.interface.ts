import { IResult as IBaseResult } from "../Result.interface"

export interface IResult<T> extends IBaseResult {
  data: T;
  SetData(data: T): void;
  SetSuccessful(data: T, message?: string): void;
  SetSuccessful(data: T, message: string, statusCode?: number): void;
}