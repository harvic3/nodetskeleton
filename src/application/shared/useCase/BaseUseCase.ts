import {
  Resources,
  localKeys as messageKeys,
  locals as messageLocals,
} from "../locals/messages/index";
import { localKeys as wordKeys, locals as wordLocals } from "../locals/words/index";
import { ILogProvider } from "../log/providerContracts/ILogProvider";
export { IResult, Result, IResultT, ResultT } from "result-tsk";
import applicationStatus from "../status/applicationStatus";
import { LocaleTypeEnum } from "../locals/LocaleType.enum";
import { UseCaseTrace } from "../log/UseCaseTrace";
import AppSettings from "../settings/AppSettings";
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
    this.appMessages = new Resources(messageLocals, messageKeys, AppSettings.DefaultLanguage);
    this.appWords = new Resources(wordLocals, wordKeys, AppSettings.DefaultLanguage);
    this.validator = new Validator(
      this.appMessages,
      this.appMessages.keys.SOME_PARAMETERS_ARE_MISSING,
      applicationStatus.INVALID_INPUT,
    );
  }

  setLocale(locale: LocaleTypeEnum): void {
    this.appMessages.init(locale);
    this.appWords.init(locale);
  }

  initializeUseCaseTrace<I>(audit: UseCaseTrace, input: I, propsToRemove?: string[]): void {
    audit.setContext(this.CONTEXT);
    audit.setArgs(input, propsToRemove);
  }

  handleResultError(result: IResult): void {
    Throw.when(this.CONTEXT, !!result?.error, result.error, result.statusCode);
  }

  abstract execute(locale: LocaleTypeEnum, trace: UseCaseTrace, args?: T): Promise<IResult>;
}
