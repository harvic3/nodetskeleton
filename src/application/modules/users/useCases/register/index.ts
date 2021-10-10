import { IWorkerProvider } from "../../../../shared/worker/providerContracts/IWorkerProvider";
import { TaskDictionaryEnum } from "../../../../shared/worker/models/TaskDictionary.enum";
import { BaseUseCase, IResult, Result } from "../../../../shared/useCase/BaseUseCase";
import { StringUtils } from "../../../../../domain/shared/utils/StringUtils";
import { IUSerRepository } from "../../providerContracts/IUser.repository";
import { WorkerTask } from "../../../../shared/worker/models/WorkerTask";
import DateTimeUtils from "../../../../shared/utils/DateTimeUtils";
import AppSettings from "../../../../shared/settings/AppSettings";
import GuidUtils from "../../../../shared/utils/GuidUtils";
import { User } from "../../../../../domain/user/User";

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

    const userExists = await this.userRepository.getByEmail(user.email.toLowerCase());
    if (userExists) {
      result.setError(
        this.resources.getWithParams(this.resourceKeys.USER_WITH_EMAIL_ALREADY_EXISTS, {
          email: user.email,
        }),
        this.applicationStatus.INVALID_INPUT,
      );
      return result;
    }

    await this.buildUser(user);

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

  private async buildUser(user: User): Promise<void> {
    user.email = user.email.toLowerCase();
    user.maskedUid = GuidUtils.getV4WithoutDashes();
    user.password = await this.encryptPassword(user);
    // This line was replaced by worker task
    //const encryptedPassword = Encryption.encrypt(`${user.email}-${user.password}`);
    user.createdAt = DateTimeUtils.getISONow();
  }

  private async encryptPassword(user: User): Promise<string> {
    const task: WorkerTask = new WorkerTask(TaskDictionaryEnum.ENCRYPT_PASSWORD);
    const workerArgs = {
      text: `${user.email}-${user.password}`,
      encryptionKey: AppSettings.EncryptionKey,
      iterations: AppSettings.EncryptionIterations,
    };
    task.setArgs(workerArgs);
    const workerResult = await this.workerProvider.executeTask<string>(task);

    return Promise.resolve(workerResult);
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
