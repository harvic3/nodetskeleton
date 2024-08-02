import messageResources, { Resources } from "../../locals/messages/index";
export { IResult, Result, IResultT, ResultT } from "result-tsk";
import { ApplicationStatus } from "../../status/applicationStatus";
import wordsResources from "../../locals/words/index";
import { Validator } from "validator-tsk";

class BaseWorker {
  appMessages: Resources = messageResources;
  appWords: Resources = wordsResources;
  applicationStatus = ApplicationStatus;
  validator: Validator = new Validator(
    messageResources,
    messageResources.keys.SOME_PARAMETERS_ARE_MISSING,
    ApplicationStatus.INVALID_INPUT,
  );
}

export default new BaseWorker();
