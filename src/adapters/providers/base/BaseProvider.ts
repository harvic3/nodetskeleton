import resources, { resourceKeys, Resources } from "../../../application/shared/locals/messages";
export { ApplicationError } from "../../../application/shared/errors/ApplicationError";
import applicationStatus from "../../../application/shared/status/applicationStatus";
import { Validator } from "validator-tsk";
import mapper, { IMap } from "mapper-tsk";
export { Result } from "result-tsk";

export abstract class BaseProvider {
  constructor() {
    this.mapper = mapper;
    this.resources = resources;
    this.validator = new Validator(
      resources,
      resourceKeys.SOME_PARAMETERS_ARE_MISSING,
      applicationStatus.INVALID_INPUT,
    );
  }

  mapper: IMap;
  validator: Validator;
  resources: Resources;
  resourceKeys = resourceKeys;
  applicationStatusCode = applicationStatus;
}
