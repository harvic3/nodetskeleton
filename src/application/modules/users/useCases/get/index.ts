import { ILogProvider } from "../../../../shared/log/providerContracts/ILogProvider";
import { ApplicationStatus } from "../../../../shared/status/applicationStatus";
import { IUserRepository } from "../../providerContracts/IUser.repository";
import { LocaleTypeEnum } from "../../../../shared/locals/LocaleType.enum";
import { UseCaseTrace } from "../../../../shared/log/UseCaseTrace";
import { Email } from "../../../../../domain/user/Email";
import { Throw } from "../../../../shared/errors/Throw";
import { IUserDto, UserDto } from "../../dtos/User.dto";
import { User } from "../../../../../domain/user/User";
import {
  ResultT,
  IResultT,
  BaseUseCase,
  ResultExecutionPromise,
} from "../../../../shared/useCase/BaseUseCase";

export class GetUserUseCase extends BaseUseCase<{ maskedUid: string }> {
  constructor(
    readonly logProvider: ILogProvider,
    private readonly userRepository: IUserRepository,
  ) {
    super(GetUserUseCase.name, logProvider);
  }

  async execute(
    locale: LocaleTypeEnum,
    trace: UseCaseTrace,
    args: { maskedUid: string },
  ): Promise<IResultT<IUserDto>> {
    this.setLocale(locale);
    const result = new ResultT<IUserDto>();

    const userDto = UserDto.fromMaskedUid(args?.maskedUid);
    if (!userDto.isValidToGet(result)) return result;
    this.initializeUseCaseTrace(trace, args, ["password"]);

    const { value: userFound } = await result.execute(this.getUser(userDto.maskedUid as string));
    if (!userFound) return result;

    trace.setSuccessful();
    return result.setData(UserDto.fromDomain(userFound).toDto(), ApplicationStatus.SUCCESS);
  }

  private validateEmail(email: Email | undefined): void {
    Throw.when(
      this.CONTEXT,
      !email?.isValid(),
      this.appMessages.get(this.appMessages.keys.INVALID_EMAIL),
      this.applicationStatus.INVALID_INPUT,
    );
  }

  private async getUser(maskedUid: string): ResultExecutionPromise<User> {
    const userFound = await this.userRepository.getByMaskedUid(maskedUid);
    if (!userFound) {
      return {
        error: this.appMessages.get(this.appMessages.keys.USER_DOES_NOT_EXIST),
        statusCode: this.applicationStatus.INVALID_INPUT,
        value: null,
      };
    }

    return {
      value: userFound as User,
    };
  }
}
