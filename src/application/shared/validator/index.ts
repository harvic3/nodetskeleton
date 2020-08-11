import { IResult } from "../result/Result.interface";
import resources, { resourceKeys } from "../locals/index";
import * as resultCodes from "../result/resultCodes.json";

export class Validator {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  IsValidEntry(result: IResult, paramsToValidate: { [key: string]: any }): boolean {
    let isValid = true;
    const keysToValidate = Object.keys(paramsToValidate);
    const keysNotFound: string[] = [];
    keysToValidate.forEach((key) => {
      if (!paramsToValidate[key]) {
        keysNotFound.push(key);
      } else if (Array.isArray(paramsToValidate[key])) {
        const validations: any[] = paramsToValidate[key];
        validations.forEach((validation) => {
          const resultMessage = validation();
          if (resultMessage) {
            keysNotFound.push(resultMessage);
          }
        });
      }
    });
    if (keysNotFound.length > 0) {
      isValid = false;
      result.SetError(
        resources.GetWithParams(resourceKeys.SOME_PARAMETERS_ARE_MISSING, {
          missingParams: keysNotFound.join(", "),
        }),
        resultCodes.BAD_REQUEST,
      );
    }
    return isValid;
  }
}

const instance = new Validator();

export default instance;
