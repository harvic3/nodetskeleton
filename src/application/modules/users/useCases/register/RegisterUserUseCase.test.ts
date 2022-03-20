import { IWorkerProvider } from "../../../../shared/worker/providerContracts/IWorkerProvider";
import { ILogProvider } from "../../../../shared/log/providerContracts/ILogProvider";
import { ApplicationErrorMock } from "../../../../mocks/ApplicationError.mock";
import resources, { resourceKeys } from "../../../../shared/locals/messages";
import applicationStatus from "../../../../shared/status/applicationStatus";
import { IUSerRepository } from "../../providerContracts/IUser.repository";
import { LocaleTypeEnum } from "../../../../shared/locals/LocaleType.enum";
import AppSettings from "../../../../shared/settings/AppSettings";
import words, { wordKeys } from "../../../../shared/locals/words";
import Encryption from "../../../../shared/security/encryption";
import { UserMock } from "../../../../mocks/User.mock";
import { User } from "../../../../../domain/user/User";
import { RegisterUserUseCase } from "./index";
import { mock } from "jest-mock-extended";

// Mocks
const logProviderMock = mock<ILogProvider>();
const userRepositoryMock = mock<IUSerRepository>();
const workerProviderMock = mock<IWorkerProvider>();

// Builders
const userBuilder = () => new UserMock();
const applicationErrorBuilder = new ApplicationErrorMock();

// Constants
const registerUserUseCase = () =>
  new RegisterUserUseCase(logProviderMock, userRepositoryMock, workerProviderMock);

describe("when try to register user", () => {
  beforeAll(() => {
    resources.setDefaultLanguage(LocaleTypeEnum.EN);
    words.setDefaultLanguage(LocaleTypeEnum.EN);
    AppSettings.EncryptionKey = "hello-alien";
    AppSettings.EncryptionIterations = 1e3;
    AppSettings.EncryptionKeySize = 64;
  });
  beforeEach(() => {
    applicationErrorBuilder.reset();
    userRepositoryMock.register.mockReset();
    userRepositoryMock.getByEmail.mockReset();
    workerProviderMock.executeTask.mockReset();
  });

  it("should return a 400 error if user properties was null or undefined", async () => {
    // Arrange
    const user = new User();

    // Act
    const result = await registerUserUseCase().execute(user);

    // Assert
    expect(result.success).toBeFalsy();
    expect(result.statusCode).toBe(applicationStatus.INVALID_INPUT);
    expect(result.error).toBe(
      resources.getWithParams(resourceKeys.SOME_PARAMETERS_ARE_MISSING, {
        missingParams: `${words.get(wordKeys.EMAIL)}, ${words.get(wordKeys.NAME)}, ${words.get(
          wordKeys.PASSWORD,
        )}, ${words.get(wordKeys.GENDER)}`,
      }),
    );
  });
  it("should return a 400 error if user don't have password", async () => {
    // Arrange
    const user = userBuilder().withName().withEmail().withGender().build();

    // Act
    const result = await registerUserUseCase().execute(user);

    // Assert
    expect(result.success).toBeFalsy();
    expect(result.statusCode).toBe(applicationStatus.INVALID_INPUT);
    expect(result.error).toBe(
      resources.getWithParams(resourceKeys.SOME_PARAMETERS_ARE_MISSING, {
        missingParams: words.get(wordKeys.PASSWORD),
      }),
    );
  });
  it("should return a 400 error if user with the same email already exists", async () => {
    // Arrange
    const user = userBuilder().withName().withEmail().withGender().withPassword().build();
    const userWithSameEmail = userBuilder()
      .withName()
      .withEmail()
      .withGender()
      .withPassword()
      .build();
    userRepositoryMock.getByEmail.mockResolvedValueOnce(userWithSameEmail);

    // Act
    const result = await registerUserUseCase().execute(user);

    // Assert
    expect(result.success).toBeFalsy();
    expect(result.statusCode).toBe(applicationStatus.INVALID_INPUT);
    expect(result.error).toBe(
      resources.getWithParams(resourceKeys.USER_WITH_EMAIL_ALREADY_EXISTS, {
        email: user?.email?.value as string,
      }),
    );
  });
  it("should return a 404 error if user email does not comply with conditions", async () => {
    // Arrange
    const notComplyEmail = "email@email";
    const useCase = registerUserUseCase();
    const user = userBuilder()
      .withName()
      .withEmail(notComplyEmail)
      .withGender()
      .withPassword()
      .build();
    applicationErrorBuilder.initialize(
      useCase.CONTEXT,
      resources.get(resourceKeys.INVALID_EMAIL),
      applicationStatus.INVALID_INPUT,
    );

    // Act
    const resultPromise = useCase.execute(user);

    // Assert
    await expect(resultPromise).rejects.toThrowError(applicationErrorBuilder.build());
  });
  it("should return a 404 error if user password does not comply with conditions", async () => {
    // Arrange
    const notComplyPassword = "abcD1234";
    const useCase = registerUserUseCase();
    const user = userBuilder()
      .withName()
      .withEmail()
      .withGender()
      .withPassword(notComplyPassword)
      .build();
    applicationErrorBuilder.initialize(
      useCase.CONTEXT,
      resources.get(resourceKeys.INVALID_PASSWORD),
      applicationStatus.INVALID_INPUT,
    );

    // Act
    const resultPromise = useCase.execute(user);

    // Assert
    await expect(resultPromise).rejects.toThrowError(applicationErrorBuilder.build());
  });
  it("should return a 500 error if Encryptor worker return an error", async () => {
    // Arrange
    const user = new UserMock().withName().withEmail().withGender().withPassword().build();
    userRepositoryMock.getByEmail.mockResolvedValueOnce(null);
    userRepositoryMock.register.mockResolvedValueOnce(user);
    const useCase = registerUserUseCase();

    applicationErrorBuilder.initialize(
      useCase.CONTEXT,
      resources.getWithParams(resourceKeys.SOME_PARAMETERS_ARE_MISSING, {
        missingParams: "text, encryptionKey, iterations",
      }),
      applicationStatus.INTERNAL_ERROR,
    );
    workerProviderMock.executeTask.mockRejectedValueOnce(applicationErrorBuilder.build());

    // Act
    const result = useCase.execute(user);

    // Assert
    await expect(result).rejects.toThrowError(applicationErrorBuilder.build());
  });
  it("should return a success if user was registered", async () => {
    // Arrange
    Encryption.init(
      AppSettings.EncryptionKey,
      AppSettings.EncryptionIterations,
      AppSettings.EncryptionKeySize,
    );
    const user = userBuilder().withName().withEmail().withGender().withPassword().build();
    userRepositoryMock.getByEmail.mockResolvedValueOnce(null);
    userRepositoryMock.register.mockResolvedValueOnce(user);
    workerProviderMock.executeTask.mockResolvedValueOnce("encrypted-password");

    // Act
    const result = await registerUserUseCase().execute(user);

    // Assert
    expect(result.success).toBeTruthy();
    expect(result.statusCode).toBe(applicationStatus.SUCCESS);
    expect(result.message).toBe(resources.get(resourceKeys.USER_WAS_CREATED));
  });
});
