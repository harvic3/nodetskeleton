import { BaseUseCase, IResult, Result } from "../../../../shared/useCase/BaseUseCase";
import { IUSerRepository } from "../../repositoryContracts/IUserRepository";
import Encryptor from "../../../../shared/security/encryption/Encryptor";
import { User } from "../../../../../domain/user/User";
import { DateTime } from "luxon";
import { v4 } from "uuid";

export class RegisterUserUseCase extends BaseUseCase {
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

    user.maskedUid = v4().replace(/-/g, "");
    const encryptedPassword = Encryptor.encrypt(`${user.email}-${user.password}`);
    user.password = encryptedPassword;
    user.createdAt = DateTime.local().toISO();
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
    validations[this.words.get(this.wordKeys.EMAIL)] = user.email;
    validations[this.words.get(this.wordKeys.NAME)] = user.name;
    validations[this.words.get(this.wordKeys.PASSWORD)] = user?.password as string;
    validations[this.words.get(this.wordKeys.GENDER)] = user.gender;

    return this.validator.isValidEntry(result, validations);
  }
}
