import { BaseUseCase, IResult, IResultT, ResultT } from "../../../../shared/useCase/BaseUseCase";
import { ICacheProvider } from "../../../../shared/cache/providerContracts/ICache.provider";
import { TryResult, TryWrapper } from "../../../../../domain/shared/utils/TryWrapper";
import { ILogProvider } from "../../../../shared/log/providerContracts/ILogProvider";
import { IEventPublisher } from "../../../../shared/messaging/bus/IEventPublisher";
import { ChannelNameEnum } from "../../../../shared/messaging/ChannelName.enum";
import { LastLoginDto } from "../../../users/messaging/queue/dtos/LastLoginDto";
import { PasswordBuilder } from "../../../../../domain/user/PasswordBuilder";
import { IEventQueue } from "../../../../shared/messaging/queue/IEventQueue";
import { BooleanUtil } from "../../../../../domain/shared/utils/BooleanUtil";
import { TopicNameEnum } from "../../../../shared/messaging/TopicName.enum";
import { IQueueBus } from "../../../../shared/messaging/queueBus/IQueueBus";
import { LocaleTypeEnum } from "../../../../shared/locals/LocaleType.enum";
import { QueueBus } from "../../../../shared/messaging/queueBus/QueueBus";
import { IAuthProvider } from "../../providerContracts/IAuth.provider";
import { UseCaseTrace } from "../../../../shared/log/UseCaseTrace";
import { ISession } from "../../../../../domain/session/ISession";
import AppSettings from "../../../../shared/settings/AppSettings";
import Encryption from "../../../../shared/security/encryption";
import { CredentialsDto } from "../../dtos/Credentials.dto";
import GuidUtil from "../../../../shared/utils/GuidUtil";
import { User } from "../../../../../domain/user/User";
import { TokenDto } from "../../dtos/TokenDto";

type ILoginRequest = {
  email: string | undefined;
  passwordB64: string | undefined;
  userAgent: string | undefined;
  ipAddress: string | undefined;
};

export class LoginUseCase extends BaseUseCase<ILoginRequest> {
  private readonly queueBus: IQueueBus;

  constructor(
    readonly logProvider: ILogProvider,
    private readonly authProvider: IAuthProvider,
    private readonly eventPublisher: IEventPublisher,
    private readonly eventQueue: IEventQueue,
    private readonly authCacheProvider: ICacheProvider,
  ) {
    super(LoginUseCase.name, logProvider);
    this.queueBus = new QueueBus(logProvider, eventPublisher, eventQueue);
  }

  async execute(
    locale: LocaleTypeEnum,
    trace: UseCaseTrace,
    args: ILoginRequest,
  ): Promise<IResultT<TokenDto>> {
    this.setLocale(locale);
    const result = new ResultT<TokenDto>();
    this.initializeUseCaseTrace(trace, args, ["passwordB64"]);

    const credentialsDto = CredentialsDto.fromJSON({
      email: args.email,
      passwordB64: args.passwordB64,
    });
    if (!this.isValidRequest(result, credentialsDto, args)) return result;

    const authenticatedResult = await this.userLogin(
      result,
      credentialsDto.email?.value as string,
      credentialsDto?.passwordBuilder as PasswordBuilder,
    );
    if (!authenticatedResult.success) return result;

    const tokenDto: TokenDto = await this.createSession(authenticatedResult.value as User);
    this.publishUserLastLoginEvent(
      authenticatedResult.value as User,
      new Date(),
      args.ipAddress as string,
      args.userAgent as string,
    );

    result.setData(tokenDto, this.applicationStatus.SUCCESS);
    trace.setSuccessful();

    return result;
  }

  private isValidRequest(
    result: IResult,
    credentialsDto: CredentialsDto,
    args: ILoginRequest,
  ): boolean {
    if (!credentialsDto.isValid(result, this.appWords, this.validator)) return false;

    const validations: Record<string, unknown> = {};
    validations[this.appWords.get(this.appWords.keys.IP_ADDRESS)] = args?.ipAddress;
    validations[this.appWords.get(this.appWords.keys.USER_AGENT)] = args?.userAgent;

    return this.validator.isValidEntry(result, validations);
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
    this.authCacheProvider.set(authenticatedUser.maskedUid as string, session);

    const token = await this.authProvider.getJwt(session);

    const tokenDto: TokenDto = new TokenDto(token, AppSettings.JWTExpirationTime);
    return Promise.resolve(tokenDto);
  }

  private async publishUserLastLoginEvent(
    user: User,
    loginDate: Date,
    ipAddress: string,
    userAgent: string,
  ): Promise<void> {
    const lastLogin = new LastLoginDto({
      userUid: user.uid as string,
      loginAt: loginDate.toISOString(),
      ipAddress,
      userAgent,
    });
    return this.queueBus.pushPub(ChannelNameEnum.QUEUE_SECURITY, TopicNameEnum.LOGGED, lastLogin);
  }
}
