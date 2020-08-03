import { IBaseResult } from "../Result.interface";
import { ResultDto } from "../ResultDto";

export interface IResult<T> extends IBaseResult {
  data: T | string;
  SetData(data: T | string, statusCode: number): void;
  ToResultDto(): ResultDto;
}
