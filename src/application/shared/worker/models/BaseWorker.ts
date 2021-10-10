import resources, { resourceKeys, Resources } from "../../locals/messages/index";
export { IResult, Result, IResultT, ResultT } from "result-tsk";
import applicationStatus from "../../status/applicationStatus";
import words, { wordKeys } from "../../locals/words/index";
import { Validator } from "validator-tsk";

class BaseWorker {
  resources: Resources = resources;
  words: Resources = words;
  resourceKeys = resourceKeys;
  wordKeys = wordKeys;
  applicationStatus = applicationStatus;
  validator: Validator = new Validator(
    resources,
    resourceKeys.SOME_PARAMETERS_ARE_MISSING,
    applicationStatus.INVALID_INPUT,
  );
}

export default new BaseWorker();
