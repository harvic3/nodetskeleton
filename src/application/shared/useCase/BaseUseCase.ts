import resources, { resourceKeys, Resources } from "../locals/messages/index";
import { ILogProvider } from "../log/providerContracts/ILogProvider";
export { IResult, Result, IResultT, ResultT } from "result-tsk";
import applicationStatus from "../status/applicationStatus";
import words, { wordKeys } from "../locals/words/index";
import { Validator } from "validator-tsk";
import mapper, { IMap } from "mapper-tsk";
import { Throw } from "../errors/Throw";
import { IResult } from "result-tsk";

export abstract class BaseUseCase<T> {
  mapper: IMap;
  validator: Validator;
  resources: Resources;
  words: Resources;
  resourceKeys = resourceKeys;
  wordKeys = wordKeys;
  applicationStatus = applicationStatus;

  constructor(public readonly CONTEXT: string, public readonly logProvider: ILogProvider) {
    this.mapper = mapper;
    this.resources = resources;
    this.words = words;
    this.validator = new Validator(
      resources,
      resourceKeys.SOME_PARAMETERS_ARE_MISSING,
      applicationStatus.INVALID_INPUT,
    );
  }

  handleResultError(result: IResult): void {
    Throw.when(this.CONTEXT, !!result?.error, result.error, result.statusCode);
  }

  abstract execute(args?: T): Promise<IResult>;
}
