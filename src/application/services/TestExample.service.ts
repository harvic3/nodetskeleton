import * as HttpError from "http-errors";
import { IResult } from "../result/generic/Result.interface";
import Result from "../result/generic/Result";

export class TestExampleService {
  async SumArrayNumbers(numbers: number[]): Promise<IResult<number>> {
    const result = new Result<number>();
    if (numbers.indexOf(null) >= 0) {
      throw HttpError(404, "Any number can be null");
    }
    result.SetSuccessful(
      await numbers.reduce((acumulator, value) => acumulator + value, 0),
    );
    return result;
  }
}
