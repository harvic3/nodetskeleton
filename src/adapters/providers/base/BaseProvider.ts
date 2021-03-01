import * as applicationStatusCode from "../../../application/shared/status/applicationStatusCodes.json";
import resources, { resourceKeys, Resources } from "../../../application/shared/locals";
export { ApplicationError } from "../../../application/shared/errors/ApplicationError";
import { Validator } from "validator-tsk";
import mapper, { IMap } from "mapper-tsk";

export class BaseProvider {
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
