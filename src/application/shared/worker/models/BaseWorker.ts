import messageResources, { Resources } from "../../locals/messages/index";
export { IResult, Result, IResultT, ResultT } from "result-tsk";
import applicationStatus from "../../status/applicationStatus";
import wordsResources from "../../locals/words/index";
import { Validator } from "validator-tsk";

class BaseWorker {
  appMessages: Resources = messageResources;
  appWords: Resources = wordsResources;
  applicationStatus = applicationStatus;
  validator: Validator = new Validator(
    messageResources,
    messageResources.keys.SOME_PARAMETERS_ARE_MISSING,
    applicationStatus.INVALID_INPUT,
  );
}

export default new BaseWorker();
