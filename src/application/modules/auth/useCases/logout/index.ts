import { IResultT, ResultExecutionPromise, ResultT, Validator } from "../../../../shared/types";
import { TryResult, TryWrapper } from "../../../../../domain/shared/utils/TryWrapper";
import { ILogProvider } from "../../../../shared/log/providerContracts/ILogProvider";
import { BaseUseCase, IResult } from "../../../../shared/useCase/BaseUseCase";
import { ApplicationStatus } from "../../../../shared/status/applicationStatus";
import { LocaleTypeEnum } from "../../../../shared/locals/LocaleType.enum";
import { IAuthProvider } from "../../providerContracts/IAuth.provider";
import { UseCaseTrace } from "../../../../shared/log/UseCaseTrace";
import { ISession } from "../../../../../domain/session/ISession";

export class LogoutUseCase extends BaseUseCase<{ session: ISession }> {
  readonly validator: Validator;

  constructor(
    readonly logProvider: ILogProvider,
    private readonly authProvider: IAuthProvider,
  ) {
    super(LogoutUseCase.name, logProvider);

    this.validator = new Validator(
      this.appMessages,
      this.appMessages.keys.SOME_PARAMETERS_ARE_MISSING,
      ApplicationStatus.INVALID_INPUT,
    );
  }

  async execute(
    locale: LocaleTypeEnum,
    trace: UseCaseTrace,
    args: { session: ISession },
  ): Promise<IResultT<{ closed: boolean }>> {
    this.setLocale(locale);
    this.initializeUseCaseTrace(trace, args);
    const result = new ResultT<{ closed: boolean }>();

    if (!this.isValid(result, args.session)) return result;

    await result.execute(this.sessionLogoff(args.session));
    if (result.hasError()) return result;

    result.setData({ closed: true }, this.applicationStatus.SUCCESS);

    return result;
  }

  isValid(result: IResult, session: ISession) {
    const validations: Record<string, unknown> = {};
    validations[this.appWords.get(this.appWords.keys.SESSION)] = !!session;
    validations[this.appWords.get(this.appWords.keys.SESSION_ID)] = !!session?.sessionId;
    validations[this.appWords.get(this.appWords.keys.SESSION_EXP)] = !!session?.exp;

    return this.validator.isValidEntry(result, validations);
  }

  private async sessionLogoff(session: ISession): ResultExecutionPromise<TryResult<boolean>> {
    const logoffResult = await TryWrapper.asyncExec(this.authProvider.registerLogout(session));

    if (!logoffResult.success) {
      return {
        error: this.appMessages.get(this.appMessages.keys.INVALID_SESSION),
        statusCode: this.applicationStatus.INVALID_INPUT,
        value: null,
      };
    }

    return {
      value: logoffResult,
    };
  }
}
