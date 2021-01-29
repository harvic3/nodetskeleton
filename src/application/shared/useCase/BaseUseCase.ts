import * as applicationStatusCode from "../status/applicationStatusCodes.json";
import resources, { resourceKeys, Resources } from "../locals/index";
export { IResult, Result, IResultT, ResultT } from "result-tsk";
import { Validator } from "validator-tsk";
import mapper, { IMap } from "mapper-tsk";

export class BaseUseCase {
  constructor() {
    this.mapper = mapper;
    this.resources = resources;
    this.validator = new Validator(
      resources,
      resourceKeys.SOME_PARAMETERS_ARE_MISSING,
      applicationStatusCode.BAD_REQUEST,
    );
  }

  mapper: IMap;
  validator: Validator;
  resources: Resources;
  resourceKeys = resourceKeys;
  applicationStatusCode = applicationStatusCode;
}
