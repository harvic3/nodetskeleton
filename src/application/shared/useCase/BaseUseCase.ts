export { IResult, Result, IResultT, ResultT, ResultExecutionPromise } from "../types";
import { ILogProvider } from "../log/providerContracts/ILogProvider";
import { ApplicationStatus } from "../status/applicationStatus";
import { LocaleTypeEnum } from "../locals/LocaleType.enum";
import messages, { Resources } from "../locals/messages";
import { UseCaseTrace } from "../log/UseCaseTrace";
import { Throw } from "../errors/Throw";
import { IResult } from "result-tsk";
import words from "../locals/words";

export { Resources };

export abstract class BaseUseCase<T> {
  appMessages: Resources;
  appWords: Resources;
  applicationStatus = ApplicationStatus;

  constructor(
    public readonly CONTEXT: string,
    public readonly logProvider: ILogProvider,
  ) {
    this.appMessages = messages;
    this.appWords = words;
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
