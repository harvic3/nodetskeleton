import messageResources, { Resources } from "../locals/messages/index";
import { ILogProvider } from "../log/providerContracts/ILogProvider";
export { IResult, Result, IResultT, ResultT } from "result-tsk";
import applicationStatus from "../status/applicationStatus";
import wordResources from "../locals/words/index";
import { Validator } from "validator-tsk";
import mapper, { IMap } from "mapper-tsk";
import { Throw } from "../errors/Throw";
import { IResult } from "result-tsk";
export { Validator, Resources };

export abstract class BaseUseCase<T> {
  mapper: IMap;
  validator: Validator;
  appMessages: Resources;
  appWords: Resources;
  applicationStatus = applicationStatus;

  constructor(public readonly CONTEXT: string, public readonly logProvider: ILogProvider) {
    this.mapper = mapper;
    this.appMessages = messageResources;
    this.appWords = wordResources;
    this.validator = new Validator(
      messageResources,
      messageResources.keys.SOME_PARAMETERS_ARE_MISSING,
      applicationStatus.INVALID_INPUT,
    );
  }

  handleResultError(result: IResult): void {
    Throw.when(this.CONTEXT, !!result?.error, result.error, result.statusCode);
  }

  abstract execute(args?: T): Promise<IResult>;
}
