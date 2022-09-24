import { BaseUseCase, IResult, IResultT, ResultT } from "../../../../shared/useCase/BaseUseCase";
import { TryResult, TryWrapper } from "../../../../../domain/shared/utils/TryWrapper";
import { ILogProvider } from "../../../../shared/log/providerContracts/ILogProvider";
import { PasswordBuilder } from "../../../../../domain/user/PasswordBuilder";
import { LocaleTypeEnum } from "../../../../shared/locals/LocaleType.enum";
import { CredentialsDto, ICredentials } from "../../dtos/Credentials.dto";
import { IAuthProvider } from "../../providerContracts/IAuth.provider";
import { UseCaseTrace } from "../../../../shared/log/UseCaseTrace";
import { ISession } from "../../../../../domain/session/ISession";
import AppSettings from "../../../../shared/settings/AppSettings";
import Encryption from "../../../../shared/security/encryption";
import GuidUtil from "../../../../shared/utils/GuidUtil";
import { User } from "../../../../../domain/user/User";
import { TokenDto } from "../../dtos/TokenDto";

export class LoginUseCase extends BaseUseCase<ICredentials> {
  constructor(readonly logProvider: ILogProvider, private readonly authProvider: IAuthProvider) {
    super(LoginUseCase.name, logProvider);
  }

  async execute(
    locale: LocaleTypeEnum,
    trace: UseCaseTrace,
    args: ICredentials,
  ): Promise<IResultT<TokenDto>> {
    this.setLocale(locale);
    const result = new ResultT<TokenDto>();
    this.initializeUseCaseTrace(trace, args, ["passwordB64"]);

    const credentialsDto = CredentialsDto.fromJSON(args);
    if (!credentialsDto.isValid(result, this.appWords, this.validator)) return result;

    const authenticatedResult = await this.userLogin(
      result,
      credentialsDto.email?.value as string,
      credentialsDto?.passwordBuilder as PasswordBuilder,
    );
    if (!authenticatedResult.success) return result;

    const tokenDto: TokenDto = await this.createSession(authenticatedResult.value as User);

    result.setData(tokenDto, this.applicationStatus.SUCCESS);
    trace.setSuccessful();

    return result;
  }

  private async userLogin(
    result: IResult,
    email: string,
    passwordBuilder: PasswordBuilder,
  ): Promise<TryResult<User>> {
    const encryptedPassword = Encryption.encrypt(passwordBuilder.value);
    const authenticatedResult = await TryWrapper.syncExec(
      this.authProvider.login(email, encryptedPassword),
    );

    if (!authenticatedResult.success) {
      result.setError(
        this.appMessages.get(this.appMessages.keys.INVALID_USER_OR_PASSWORD),
        this.applicationStatus.INVALID_INPUT,
      );
    }

    return authenticatedResult;
  }

  private async createSession(authenticatedUser: User): Promise<TokenDto> {
    const session: ISession = authenticatedUser.createSession(GuidUtil.getV4());
    const token = await this.authProvider.getJwt(session);

    const tokenDto: TokenDto = new TokenDto(token, AppSettings.JWTExpirationTime);
    return Promise.resolve(tokenDto);
  }
}
