import { BaseUseCase, IResult, Result } from "../../../../shared/useCase/BaseUseCase";
import { StringUtils } from "../../../../../domain/shared/utils/StringUtils";
import { IUSerRepository } from "../../providerContracts/IUser.repository";
import DateTimeUtils from "../../../../shared/utils/DateTimeUtils";
import Encryption from "../../../../shared/security/encryption";
import GuidUtils from "../../../../shared/utils/GuidUtils";
import { User } from "../../../../../domain/user/User";

export class RegisterUserUseCase extends BaseUseCase<User> {
  constructor(private readonly userRepository: IUSerRepository) {
    super();
  }

  async execute(user: User): Promise<IResult> {
    const result = new Result();
    if (!this.isValidRequest(result, user)) {
      return result;
    }

    user.email = user.email.toLowerCase();
    const userExists = await this.userRepository.getByEmail(user.email);
    if (userExists) {
      result.setError(
        this.resources.getWithParams(this.resourceKeys.USER_WITH_EMAIL_ALREADY_EXISTS, {
          email: user.email,
        }),
        this.applicationStatus.INVALID_INPUT,
      );
      return result;
    }

    user.maskedUid = GuidUtils.getV4WithoutDashes();
    const encryptedPassword = Encryption.encrypt(`${user.email}-${user.password}`);
    user.password = encryptedPassword;
    user.createdAt = DateTimeUtils.getISONow();
    const registered = await this.userRepository.register(user);

    if (!registered) {
      result.setError(
        this.resources.get(this.resourceKeys.ERROR_CREATING_USER),
        this.applicationStatus.INTERNAL_ERROR,
      );
      return result;
    }

    result.setMessage(
      this.resources.get(this.resourceKeys.USER_WAS_CREATED),
      this.applicationStatus.SUCCESS,
    );

    return result;
  }

  private isValidRequest(result: Result, user: User): boolean {
    const validations = {};
    validations[this.words.get(this.wordKeys.EMAIL)] = user?.email;
    validations[this.words.get(this.wordKeys.NAME)] = user?.name;
    validations[this.words.get(this.wordKeys.PASSWORD)] = StringUtils.isValidAsPassword(
      StringUtils.decodeBase64(user?.password as string),
    );
    validations[this.words.get(this.wordKeys.GENDER)] = user.gender;

    return this.validator.isValidEntry(result, validations);
  }
}
