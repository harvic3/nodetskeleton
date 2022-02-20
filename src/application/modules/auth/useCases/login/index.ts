import { BaseUseCase, IResult, IResultT, ResultT } from "../../../../shared/useCase/BaseUseCase";
import { IAuthProvider } from "../../providerContracts/IAuth.provider";
import { Nulldifined } from "../../../../../domain/shared/Nulldifined";
import { ISession } from "../../../../../domain/session/ISession";
import AppSettings from "../../../../shared/settings/AppSettings";
import { User } from "../../../../../domain/user/User";
import { TokenDto } from "../../dtos/TokenDto";

export class LoginUseCase extends BaseUseCase<{
  email: string | Nulldifined;
  passwordB64: string | Nulldifined;
}> {
  constructor(private readonly authProvider: IAuthProvider) {
    super(LoginUseCase.name);
  }

  async execute(args: {
    email: string | undefined;
    passwordB64: string | Nulldifined;
  }): Promise<IResultT<TokenDto>> {
    const result = new ResultT<TokenDto>();
    if (!this.isValidRequest(result, args?.email, args?.passwordB64)) {
      return result;
    }

    const authenticatedUser: User | null = await this.authProvider
      .login(args.email as string, args.passwordB64 as string)
      .catch(() => {
        result.setError(
          this.resources.get(this.resourceKeys.INVALID_USER_OR_PASSWORD),
          this.applicationStatus.INVALID_INPUT,
        );
        return null;
      });

    if (!authenticatedUser) {
      return result;
    }

    const tokenDto: TokenDto = await this.createSession(authenticatedUser);

    result.setData(tokenDto, this.applicationStatus.SUCCESS);

    return result;
  }

  private async createSession(authenticatedUser: User): Promise<TokenDto> {
    const session: ISession = authenticatedUser.createSession();
    const token = await this.authProvider.getJwt(session);

    const tokenDto: TokenDto = new TokenDto(token, AppSettings.JWTExpirationTime);
    return Promise.resolve(tokenDto);
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
}
