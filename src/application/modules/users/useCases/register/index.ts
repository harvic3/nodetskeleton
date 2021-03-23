import { BaseUseCase, IResult, Result } from "../../../../shared/useCase/BaseUseCase";
import { IUSerRepository } from "../../repositoryContracts/IUserRepository";
import { User } from "../../../../../domain/user/User";

export class RegisterUserUseCase extends BaseUseCase {
  constructor(private readonly userRepository: IUSerRepository) {
    super();
  }

  async execute(user: User): Promise<IResult> {
    const result = new Result();
    if (!this.isValidRequest(result, user)) {
      return result;
    }

    const registered = await this.userRepository.register(user);

    if (!registered) {
      result.setError(
        this.resources.get(this.resourceKeys.ERROR_CREATING_USER),
        this.applicationStatusCode.INTERNAL_SERVER_ERROR,
      );
      return result;
    }

    result.setMessage(
      this.resources.get(this.resourceKeys.USER_WAS_CREATED),
      this.applicationStatusCode.SUCCESS,
    );

    return result;
  }

  private isValidRequest(result: Result, user: User): boolean {
    const validations = {};
    validations["Email"] = user.email;
    validations["Name"] = user.name;
    validations["Password"] = user?.password as string;
    validations["Gender"] = user.gender;

    return this.validator.isValidEntry(result, validations);
  }
}