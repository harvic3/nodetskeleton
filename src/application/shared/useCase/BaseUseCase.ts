import validator, { Validator } from "../validator/index";
import * as resultCodes from "../result/resultCodes.json";
import resources, { resourceKeys, Resources } from "../locals/index";
import { IMap } from "../mapper/IMap";
import mapper from "../mapper";

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
