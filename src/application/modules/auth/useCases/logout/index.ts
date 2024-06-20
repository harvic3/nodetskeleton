import { BaseUseCase, IResult } from "../../../../shared/useCase/BaseUseCase";
import { ILogProvider } from "../../../../shared/log/providerContracts/ILogProvider";
import { LocaleTypeEnum } from "../../../../shared/locals/LocaleType.enum";
import { UseCaseTrace } from "../../../../shared/log/UseCaseTrace";
import { ISession } from "../../../../../domain/session/ISession";
import { ResultExecutionPromise, ResultT, Validator } from "../../../../shared/types";
import applicationStatus from "../../../../shared/status/applicationStatus";
import { IAuthProvider } from "../../providerContracts/IAuth.provider";
import { TryResult, TryWrapper } from "../../../../../domain/shared/utils/TryWrapper";

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
      applicationStatus.INVALID_INPUT,
    );
  }

  async execute(
    locale: LocaleTypeEnum,
    trace: UseCaseTrace,
    args: { session: ISession },
  ): Promise<IResult> {
    this.setLocale(locale);
    this.initializeUseCaseTrace(trace, args);
    const result = new ResultT<Boolean>();

    if (!this.isValid(result, args.session)) return result;

    await result.execute(this.sessionLogoff(args.session));

    result.setData(!result.hasError(), this.applicationStatus.SUCCESS);

    return result;
  }

  isValid(result: IResult, session: ISession) {
    const validations: Record<string, unknown> = {};
    validations[this.appWords.get(this.appWords.keys.SESSION)] = !!session;
    validations[this.appWords.get(this.appWords.keys.SESSION_ID)] = !!session?.sessionId;
    validations[this.appWords.get(this.appWords.keys.SESSION_EXP)] = !!session?.exp;

    return this.validator.isValidEntry(result, validations);
  }

  private async sessionLogoff(session: ISession): ResultExecutionPromise<TryResult<Boolean>> {
    const logoffResult = await TryWrapper.asyncExec(this.authProvider.registerLogout(session));

    return {
      value: logoffResult,
    };
  }
}
