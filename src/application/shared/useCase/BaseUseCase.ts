import resources, { resourceKeys, Resources } from "../locals/index";
export { IResult, Result, IResultT, ResultT } from "result-tsk";
import * as resultCodes from "../result/resultCodes.json";
import { Validator } from "validator-tsk";
import mapper, { IMap } from "mapper-tsk";

const validator = new Validator(resources, resourceKeys.SOME_PARAMETERS_ARE_MISSING);

export class BaseUseCase {
  constructor() {
    this.validator = validator;
    this.resources = resources;
    this.mapper = mapper;
  }
  mapper: IMap;
  validator: Validator;
  resources: Resources;
  resourceKeys = resourceKeys;
  resultCodes = resultCodes;
}
