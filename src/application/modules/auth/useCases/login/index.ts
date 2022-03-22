import { BaseUseCase, IResult, IResultT, ResultT } from "../../../../shared/useCase/BaseUseCase";
import { ILogProvider } from "../../../../shared/log/providerContracts/ILogProvider";
import { TryResult, TryWrapper } from "../../../../../domain/shared/utils/TryWrapper";
import { IAuthProvider } from "../../providerContracts/IAuth.provider";
import { Nulldifined } from "../../../../../domain/shared/Nulldifined";
import { ISession } from "../../../../../domain/session/ISession";
import AppSettings from "../../../../shared/settings/AppSettings";
import GuidUtil from "../../../../shared/utils/GuidUtils";
import { User } from "../../../../../domain/user/User";
import { TokenDto } from "../../dtos/TokenDto";

export class LoginUseCase extends BaseUseCase<{
  email: string | Nulldifined;
  passwordB64: string | Nulldifined;
}> {
  constructor(readonly logProvider: ILogProvider, private readonly authProvider: IAuthProvider) {
    super(LoginUseCase.name, logProvider);
  }

  async execute(args: {
    email: string | undefined;
    passwordB64: string | Nulldifined;
  }): Promise<IResultT<TokenDto>> {
    const result = new ResultT<TokenDto>();
    if (!this.isValidRequest(result, args?.email, args?.passwordB64)) return result;

    const authenticatedResult = await this.userLogin(
      result,
      args?.email as string,
      args?.passwordB64 as string,
    );
    if (!authenticatedResult.success) return result;

    const tokenDto: TokenDto = await this.createSession(authenticatedResult.value as User);

    result.setData(tokenDto, this.applicationStatus.SUCCESS);

    return result;
  }

  private isValidRequest(
    result: IResult,
    email: string | Nulldifined,
    passwordB64: string | Nulldifined,
  ): boolean {
    const validations: Record<string, unknown> = {};
    validations[this.words.get(this.wordKeys.EMAIL)] = email;
    validations[this.words.get(this.wordKeys.PASSWORD)] = passwordB64;

    return this.validator.isValidEntry(result, validations);
  }

  private async userLogin(
    result: IResult,
    email: string,
    passwordB64: string,
  ): Promise<TryResult<User>> {
    const authenticatedResult = await TryWrapper.syncExec(
      this.authProvider.login(email, passwordB64),
    );

    if (!authenticatedResult.success) {
      result.setError(
        this.resources.get(this.resourceKeys.INVALID_USER_OR_PASSWORD),
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
