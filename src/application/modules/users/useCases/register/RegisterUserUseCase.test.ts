import { IWorkerProvider } from "../../../../shared/worker/providerContracts/IWorkerProvider";
import { ILogProvider } from "../../../../shared/log/providerContracts/ILogProvider";
import { ApplicationErrorMock } from "../../../../mocks/ApplicationError.mock";
import applicationStatus from "../../../../shared/status/applicationStatus";
import { IUSerRepository } from "../../providerContracts/IUser.repository";
import { StringUtil } from "../../../../../domain/shared/utils/StringUtil";
import { LocaleTypeEnum } from "../../../../shared/locals/LocaleType.enum";
import { UseCaseTraceMock } from "../../../../mocks/UseCaseTrace.mock";
import AppSettings from "../../../../shared/settings/AppSettings";
import Encryption from "../../../../shared/security/encryption";
import { UserDtoMock } from "../../../../mocks/UserDto.mock";
import { SessionMock } from "../../../../mocks/Session.mock";
import appMessages from "../../../../shared/locals/messages";
import appWords from "../../../../shared/locals/words";
import { UserMock } from "../../../../mocks/User.mock";
import { IUserDto } from "../../dtos/User.dto";
import { RegisterUserUseCase } from "./index";
import { mock } from "jest-mock-extended";

// Mocks
const logProviderMock = mock<ILogProvider>();
const userRepositoryMock = mock<IUSerRepository>();
const workerProviderMock = mock<IWorkerProvider>();

// Builders
const userBuilder = () => new UserMock();
const userDtoBuilder = () => new UserDtoMock();
const applicationErrorBuilder = new ApplicationErrorMock();
const useCaseTraceBuilder = () => new UseCaseTraceMock();
const sessionBuilder = () => new SessionMock();

// Constants
const registerUserUseCase = () =>
  new RegisterUserUseCase(logProviderMock, userRepositoryMock, workerProviderMock);

describe("when try to register user", () => {
  beforeAll(() => {
    appMessages.setDefaultLanguage(LocaleTypeEnum.EN);
    appWords.setDefaultLanguage(LocaleTypeEnum.EN);
    AppSettings.EncryptionKey = "hello-alien";
    AppSettings.EncryptionIterations = 1e3;
    AppSettings.EncryptionKeySize = 64;
  });
  beforeEach(() => {
    userRepositoryMock.register.mockReset();
    userRepositoryMock.getByEmail.mockReset();
    workerProviderMock.executeTask.mockReset();
  });

  it("should return a 400 error if user properties was null or undefined", async () => {
    // Arrange
    const userDto = {} as IUserDto;

    // Act
    const result = await registerUserUseCase().execute(
      LocaleTypeEnum.EN,
      useCaseTraceBuilder().byDefault(sessionBuilder().byDefault().build()).build(),
      userDto,
    );

    // Assert
    expect(result.success).toBeFalsy();
    expect(result.statusCode).toBe(applicationStatus.INVALID_INPUT);
    expect(result.error).toBe(
      appMessages.getWithParams(appMessages.keys.SOME_PARAMETERS_ARE_MISSING, {
        missingParams: [
          appWords.get(appWords.keys.FIRST_NAME),
          appWords.get(appWords.keys.LAST_NAME),
          appWords.get(appWords.keys.EMAIL),
          appWords.get(appWords.keys.PASSWORD),
          appWords.get(appWords.keys.GENDER),
        ].join(StringUtil.COMMA_SPACE_SEPARATOR),
      }),
    );
  });
  it("should return a 400 error if user don't have password", async () => {
    // Arrange
    const userDto = userDtoBuilder()
      .withFirstName()
      .withLastName()
      .withEmail()
      .withGender()
      .build();

    // Act
    const result = await registerUserUseCase().execute(
      LocaleTypeEnum.EN,
      useCaseTraceBuilder().byDefault(sessionBuilder().byDefault().build()).build(),
      userDto,
    );

    // Assert
    expect(result.success).toBeFalsy();
    expect(result.statusCode).toBe(applicationStatus.INVALID_INPUT);
    expect(result.error).toBe(
      appMessages.getWithParams(appMessages.keys.SOME_PARAMETERS_ARE_MISSING, {
        missingParams: appWords.get(appWords.keys.PASSWORD),
      }),
    );
  });
  it("should return a 400 error if user with the same email already exists", async () => {
    // Arrange
    const userDto = userDtoBuilder()
      .withFirstName()
      .withLastName()
      .withEmail()
      .withGender()
      .withPassword()
      .build();
    const userWithSameEmail = userBuilder().withFirstName().withEmail().withGender().build();
    userRepositoryMock.getByEmail.mockResolvedValueOnce(userWithSameEmail);

    // Act
    const result = await registerUserUseCase().execute(
      LocaleTypeEnum.EN,
      useCaseTraceBuilder().byDefault(sessionBuilder().byDefault().build()).build(),
      userDto,
    );

    // Assert
    expect(result.success).toBeFalsy();
    expect(result.statusCode).toBe(applicationStatus.INVALID_INPUT);
    expect(result.error).toBe(
      appMessages.getWithParams(appMessages.keys.USER_WITH_EMAIL_ALREADY_EXISTS, {
        email: userDto?.email as string,
      }),
    );
  });
  it("should return a 404 error if user email does not comply with conditions", async () => {
    // Arrange
    const notComplyEmail = "email@email";
    const useCase = registerUserUseCase();
    const userDto = userDtoBuilder()
      .withFirstName()
      .withLastName()
      .withEmail(notComplyEmail)
      .withPassword()
      .withGender()
      .build();
    applicationErrorBuilder.initialize(
      useCase.CONTEXT,
      appMessages.get(appMessages.keys.INVALID_EMAIL),
      applicationStatus.INVALID_INPUT,
    );

    // Act
    const resultPromise = useCase.execute(
      LocaleTypeEnum.EN,
      useCaseTraceBuilder().byDefault(sessionBuilder().byDefault().build()).build(),
      userDto,
    );

    // Assert
    await expect(resultPromise).rejects.toThrowError(applicationErrorBuilder.build());
  });
  it("should return a 404 error if user password does not comply with conditions", async () => {
    // Arrange
    const notComplyPassword = "abcD1234";
    const useCase = registerUserUseCase();
    const userDto = userDtoBuilder()
      .withFirstName()
      .withLastName()
      .withEmail()
      .withGender()
      .withPassword(notComplyPassword)
      .build();
    applicationErrorBuilder.initialize(
      useCase.CONTEXT,
      appMessages.get(appMessages.keys.INVALID_PASSWORD),
      applicationStatus.INVALID_INPUT,
    );

    // Act
    const resultPromise = useCase.execute(
      LocaleTypeEnum.EN,
      useCaseTraceBuilder().byDefault(sessionBuilder().byDefault().build()).build(),

      userDto,
    );

    // Assert
    await expect(resultPromise).rejects.toThrowError(applicationErrorBuilder.build());
  });
  it("should return a 500 error if Encryptor worker return an error", async () => {
    // Arrange
    const userDto = userDtoBuilder()
      .withFirstName()
      .withLastName()
      .withEmail()
      .withGender()
      .withPassword()
      .build();
    const createdUser = userBuilder().withFirstName().withEmail().withGender().build();
    userRepositoryMock.getByEmail.mockResolvedValueOnce(null);
    userRepositoryMock.register.mockResolvedValueOnce(createdUser);
    const useCase = registerUserUseCase();

    applicationErrorBuilder.initialize(
      useCase.CONTEXT,
      appMessages.getWithParams(appMessages.keys.SOME_PARAMETERS_ARE_MISSING, {
        missingParams: "text, encryptionKey, iterations",
      }),
      applicationStatus.INTERNAL_ERROR,
    );
    workerProviderMock.executeTask.mockRejectedValueOnce(applicationErrorBuilder.build());

    // Act
    const result = useCase.execute(
      LocaleTypeEnum.EN,
      useCaseTraceBuilder().byDefault(sessionBuilder().byDefault().build()).build(),

      userDto,
    );

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
    const userDto = userDtoBuilder()
      .withFirstName()
      .withLastName()
      .withEmail()
      .withGender()
      .withPassword()
      .build();
    const createdUser = userBuilder()
      .withFirstName()
      .withLastName()
      .withEmail()
      .withGender()
      .build();

    userRepositoryMock.getByEmail.mockResolvedValueOnce(null);
    userRepositoryMock.register.mockResolvedValueOnce(createdUser);
    workerProviderMock.executeTask.mockResolvedValueOnce("encrypted-password");

    // Act
    const result = await registerUserUseCase().execute(
      LocaleTypeEnum.EN,
      useCaseTraceBuilder().byDefault(sessionBuilder().byDefault().build()).build(),

      userDto,
    );

    // Assert
    expect(result.success).toBeTruthy();
    expect(result.statusCode).toBe(applicationStatus.SUCCESS);
    expect(result.message).toBe(appMessages.get(appMessages.keys.USER_WAS_CREATED));
  });
});
