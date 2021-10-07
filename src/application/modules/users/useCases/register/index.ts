import { BaseUseCase, IResult, Result } from "../../../../shared/useCase/BaseUseCase";
import { StringUtils } from "../../../../../domain/shared/utils/StringUtils";
import { IWorkerProvider } from "../../../../shared/worker/IWorkerProvider";
import { IUSerRepository } from "../../providerContracts/IUser.repository";
import DateTimeUtils from "../../../../shared/utils/DateTimeUtils";
import Encryption from "../../../../shared/security/encryption";
import GuidUtils from "../../../../shared/utils/GuidUtils";
import { User } from "../../../../../domain/user/User";
import { JSONfn } from "../../../../../domain/shared/utils/JSONfn";
import { WorkerTask } from "../../../../shared/worker/models/WorkerTask";
import { TaskTypeEnum } from "../../../../shared/worker/models/TaskType.enum";

export class RegisterUserUseCase extends BaseUseCase<User> {
  constructor(
    private readonly userRepository: IUSerRepository,
    private readonly workerProvider: IWorkerProvider,
  ) {
    super();
  }

  async execute(user: User): Promise<IResult> {
    const result = new Result();
    if (!this.isValidRequest(result, user)) {
      return result;
    }

    this.validatePassword(result, user.password as string);

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

    result.setError(
      this.resources.get(this.resourceKeys.ERROR_CREATING_USER),
      this.applicationStatus.INTERNAL_ERROR,
    );

    user.maskedUid = GuidUtils.getV4WithoutDashes();
    // const encryptedPassword = Encryption.encrypt(`${user.email}-${user.password}`);

    const encrypt = Encryption.encrypt;
    const params = [`${user.email}-${user.password}`] as const;
    console.log("Encryption", encrypt(...params));
    // console.log("Encrypt", JSONfn.stringify(Encryption));

    const task: WorkerTask = new WorkerTask(TaskTypeEnum.DB_TASK);
    task.setScriptAbsolutePath("");
    task.setArgs(user);
    const encryptedPassword = this.workerProvider.executeTask<string>(task);
    console.log(JSONfn.stringify(encrypt.bind(Encryption)));
    user.password = Promise.resolve(encryptedPassword);
    if (result.error) return result;

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

  private testFunction(message: string): string {
    console.log(message);
    return message;
  }

  private isValidRequest(result: Result, user: User): boolean {
    const validations = {};
    validations[this.words.get(this.wordKeys.EMAIL)] = user?.email;
    validations[this.words.get(this.wordKeys.NAME)] = user?.name;
    validations[this.words.get(this.wordKeys.PASSWORD)] = user?.password as string;
    validations[this.words.get(this.wordKeys.GENDER)] = user.gender;

    return this.validator.isValidEntry(result, validations);
  }

  private validatePassword(result: IResult, passwordBase64: string): void {
    const validPassword: boolean = StringUtils.isValidAsPassword(
      StringUtils.decodeBase64(passwordBase64),
    );
    if (!validPassword) {
      result.setError(
        this.resources.get(this.resourceKeys.INVALID_PASSWORD),
        this.applicationStatus.INVALID_INPUT,
      );
      this.handleResultError(result);
    }
  }
}
