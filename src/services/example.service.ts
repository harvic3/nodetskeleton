import { IExampleService } from "./example.service.interface";
import * as HttpError from "http-errors";

export class ExampleService implements IExampleService {
   sumTwoNumbers(numberA: number, numberB: number): number {
     if (numberA == null || numberB == null) {
      throw HttpError(404, "Any number can be null");
     }
    return numberA + numberB;
  }
  async sumArrayNumbers(numbers: number[]): Promise<number> {
    if (numbers.indexOf(null) >= 0){
      throw HttpError(404, "Any number can be null");
    }
    return numbers.reduce((acumulator, value) => acumulator + value, 0);
  }
}

