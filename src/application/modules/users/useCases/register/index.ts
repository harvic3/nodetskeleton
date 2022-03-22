import { IWorkerProvider } from "../../../../shared/worker/providerContracts/IWorkerProvider";
import { TaskDictionaryEnum } from "../../../../shared/worker/models/TaskDictionary.enum";
import { BaseUseCase, IResult, Result } from "../../../../shared/useCase/BaseUseCase";
import { ILogProvider } from "../../../../shared/log/providerContracts/ILogProvider";
import { BooleanUtil } from "../../../../../domain/shared/utils/BooleanUtil";
import { StringUtil } from "../../../../../domain/shared/utils/StringUtil";
import { IUSerRepository } from "../../providerContracts/IUser.repository";
import { WorkerTask } from "../../../../shared/worker/models/WorkerTask";
import DateTimeUtils from "../../../../shared/utils/DateTimeUtils";
import AppSettings from "../../../../shared/settings/AppSettings";
import GuidUtil from "../../../../shared/utils/GuidUtils";
import { IUser } from "../../../../../domain/user/IUser";
import { Email } from "../../../../../domain/user/Email";
import { Throw } from "../../../../shared/errors/Throw";
import { User } from "../../../../../domain/user/User";

export class RegisterUserUseCase extends BaseUseCase<IUser> {
  constructor(
    readonly logProvider: ILogProvider,
    private readonly userRepository: IUSerRepository,
    private readonly workerProvider: IWorkerProvider,
  ) {
    super(RegisterUserUseCase.name, logProvider);
  }

  async execute(userData: IUser): Promise<IResult> {
    const result = new Result();
    if (!this.isValidRequest(result, userData)) return result;

    this.validateEmail(userData.email);

    this.validatePassword((userData as User)?.password as string);

    const userExists = await this.userExists(result, userData);
    if (userExists) return result;

    const user = await this.buildUser(userData);

    const userRegistered = await this.registerUser(result, user);
    if (!userRegistered) return result;

    result.setMessage(
      this.resources.get(this.resourceKeys.USER_WAS_CREATED),
      this.applicationStatus.SUCCESS,
    );

    return result;
  }

  private isValidRequest(result: Result, user: IUser): boolean {
    const validations: Record<string, unknown> = {};
    validations[this.words.get(this.wordKeys.EMAIL)] = user?.email?.value;
    validations[this.words.get(this.wordKeys.NAME)] = user?.name;
    validations[this.words.get(this.wordKeys.PASSWORD)] = (user as User)?.password as string;
    validations[this.words.get(this.wordKeys.GENDER)] = user?.gender;

    return this.validator.isValidEntry(result, validations);
  }

  private validateEmail(email: Email | undefined): void {
    const isValidEmail = email?.isValid();
    Throw.when(
      this.CONTEXT,
      !isValidEmail,
      this.resources.get(this.resourceKeys.INVALID_EMAIL),
      this.applicationStatus.INVALID_INPUT,
    );
  }

  private validatePassword(passwordBase64: string): void {
    const isValidPassword = StringUtil.isValidAsPassword(StringUtil.decodeBase64(passwordBase64));
    Throw.when(
      this.CONTEXT,
      !isValidPassword,
      this.resources.get(this.resourceKeys.INVALID_PASSWORD),
      this.applicationStatus.INVALID_INPUT,
    );
  }

  private async userExists(result: IResult, userData: IUser): Promise<boolean> {
    const userExists = await this.userRepository.getByEmail(userData.email?.value);
    if (userExists) {
      result.setError(
        this.resources.getWithParams(this.resourceKeys.USER_WITH_EMAIL_ALREADY_EXISTS, {
          email: userData?.email?.value as string,
        }),
        this.applicationStatus.INVALID_INPUT,
      );
      return BooleanUtil.TRUE;
    }

    return BooleanUtil.FALSE;
  }

  private async buildUser(user: IUser): Promise<User> {
    user.maskedUid = GuidUtil.getV4WithoutDashes();
    user.createdAt = DateTimeUtils.getISONow();
    const buildedUser = User.fromIUser(user);
    buildedUser.password = await this.encryptPassword(user);

    return buildedUser;
  }

  private async encryptPassword(user: IUser): Promise<string> {
    const task: WorkerTask = new WorkerTask(TaskDictionaryEnum.ENCRYPT_PASSWORD);
    const workerArgs = {
      text: `${user.email}-${(user as User).password}`,
      encryptionKey: AppSettings.EncryptionKey,
      iterations: AppSettings.EncryptionIterations,
    };
    task.setArgs(workerArgs);
    const workerResult = await this.workerProvider.executeTask<string>(task);

    return Promise.resolve(workerResult);
  }

  private async registerUser(result: IResult, user: IUser): Promise<boolean> {
    const registeredUser = await this.userRepository.register(user);

    if (!registeredUser) {
      result.setError(
        this.resources.get(this.resourceKeys.ERROR_CREATING_USER),
        this.applicationStatus.INTERNAL_ERROR,
      );
      return BooleanUtil.FALSE;
    }

    return BooleanUtil.TRUE;
  }
}
