import { IWorkerProvider } from "../../../../shared/worker/providerContracts/IWorkerProvider";
import { ILogProvider } from "../../../../shared/log/providerContracts/ILogProvider";
import { ApplicationStatus } from "../../../../shared/status/applicationStatus";
import { ApplicationErrorMock } from "../../../../mocks/ApplicationError.mock";
import { IUserRepository } from "../../providerContracts/IUser.repository";
import { StringUtil } from "../../../../../domain/shared/utils/StringUtil";
import { LocaleTypeEnum } from "../../../../shared/locals/LocaleType.enum";
import { UseCaseTraceMock } from "../../../../mocks/UseCaseTrace.mock";
import { MockConstants } from "../../../../mocks/MockConstants.mock";
import AppSettings from "../../../../shared/settings/AppSettings";
import Encryption from "../../../../shared/security/encryption";
import { UserDtoMock } from "../../../../mocks/UserDto.mock";
import { SessionMock } from "../../../../mocks/Session.mock";
import appMessages from "../../../../shared/locals/messages";
import appWords from "../../../../shared/locals/words";
import { UserMock } from "../../../../mocks/User.mock";
import { RegisterUserUseCase } from "./index";
import { mock } from "jest-mock-extended";

// Mocks
const logProviderMock = mock<ILogProvider>();
const userRepositoryMock = mock<IUserRepository>();
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
    const userDto = userDtoBuilder().getDefined();

    // Act
    const result = await registerUserUseCase().execute(
      LocaleTypeEnum.EN,
      useCaseTraceBuilder().byDefault(sessionBuilder().byDefault().build()).build(),
      userDto,
    );

    // Assert
    expect(result.success).toBeFalsy();
    expect(result.statusCode).toBe(ApplicationStatus.INVALID_INPUT);
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
    const userDto = userDtoBuilder().withoutPassword().build();

    // Act
    const result = await registerUserUseCase().execute(
      LocaleTypeEnum.EN,
      useCaseTraceBuilder().byDefault(sessionBuilder().byDefault().build()).build(),
      userDto,
    );

    // Assert
    expect(result.success).toBeFalsy();
    expect(result.statusCode).toBe(ApplicationStatus.INVALID_INPUT);
    expect(result.error).toBe(
      appMessages.getWithParams(appMessages.keys.SOME_PARAMETERS_ARE_MISSING, {
        missingParams: appWords.get(appWords.keys.PASSWORD),
      }),
    );
  });
  it("should return a 400 error if user with the same email already exists", async () => {
    // Arrange
    const userDto = userDtoBuilder()
      .withSpecificName(MockConstants.USER_FIRST_NAME, MockConstants.USER_LAST_NAME)
      .build();
    const userWithSameEmail = userBuilder()
      .withSpecificName(MockConstants.USER_FIRST_NAME, MockConstants.USER_LAST_NAME)
      .build();
    userRepositoryMock.getByEmail.mockResolvedValueOnce(userWithSameEmail);

    // Act
    const result = await registerUserUseCase().execute(
      LocaleTypeEnum.EN,
      useCaseTraceBuilder().byDefault(sessionBuilder().byDefault().build()).build(),
      userDto,
    );

    // Assert
    expect(result.success).toBeFalsy();
    expect(result.statusCode).toBe(ApplicationStatus.INVALID_INPUT);
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
    const userDto = userDtoBuilder().withWrongEmail(notComplyEmail).build();
    applicationErrorBuilder.set(
      useCase.CONTEXT,
      appMessages.get(appMessages.keys.INVALID_EMAIL),
      ApplicationStatus.INVALID_INPUT,
    );

    // Act
    const resultPromise = useCase.execute(
      LocaleTypeEnum.EN,
      useCaseTraceBuilder().byDefault(sessionBuilder().byDefault().build()).build(),
      userDto,
    );

    // Assert
    await expect(resultPromise).rejects.toThrow(applicationErrorBuilder.build());
  });
  it("should return a 404 error if user password does not comply with conditions", async () => {
    // Arrange
    const notComplyPassword = "abcD1234";
    const useCase = registerUserUseCase();
    const userDto = userDtoBuilder().withWrongPassword(notComplyPassword).build();
    applicationErrorBuilder.set(
      useCase.CONTEXT,
      appMessages.get(appMessages.keys.INVALID_PASSWORD),
      ApplicationStatus.INVALID_INPUT,
    );

    // Act
    const resultPromise = useCase.execute(
      LocaleTypeEnum.EN,
      useCaseTraceBuilder().byDefault(sessionBuilder().byDefault().build()).build(),

      userDto,
    );

    // Assert
    await expect(resultPromise).rejects.toThrow(applicationErrorBuilder.build());
  });
  it("should return a 500 error if Encryptor worker return an error", async () => {
    // Arrange
    const userDto = userDtoBuilder().byDefault().build();
    // const createdUser = userBuilder().withFirstName().withEmail().withGender().build();
    userRepositoryMock.getByEmail.mockResolvedValueOnce(null);
    // userRepositoryMock.register.mockResolvedValueOnce(createdUser);
    const useCase = registerUserUseCase();

    applicationErrorBuilder.set(
      useCase.CONTEXT,
      appMessages.getWithParams(appMessages.keys.SOME_PARAMETERS_ARE_MISSING, {
        missingParams: "text, encryptionKey, iterations",
      }),
      ApplicationStatus.INTERNAL_ERROR,
    );
    workerProviderMock.executeTask.mockRejectedValueOnce(applicationErrorBuilder.build());

    // Act
    const result = useCase.execute(
      LocaleTypeEnum.EN,
      useCaseTraceBuilder().byDefault(sessionBuilder().byDefault().build()).build(),

      userDto,
    );

    // Assert
    await expect(result).rejects.toThrow(applicationErrorBuilder.build());
  });
  it("should return a success if user was registered", async () => {
    // Arrange
    Encryption.init(
      AppSettings.EncryptionKey,
      AppSettings.EncryptionIterations,
      AppSettings.EncryptionKeySize,
    );
    const userDto = userDtoBuilder().byDefault().build();
    const createdUser = userBuilder()
      .fromJSON(userDto, MockConstants.USER_ID, MockConstants.USER_MASKED_ID)
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
    expect(result.statusCode).toBe(ApplicationStatus.SUCCESS);
    expect(result.message).toBe(appMessages.get(appMessages.keys.USER_WAS_CREATED));
  });

  it("should return an Error because the user was not registered", async () => {
    // Arrange
    Encryption.init(
      AppSettings.EncryptionKey,
      AppSettings.EncryptionIterations,
      AppSettings.EncryptionKeySize,
    );
    const userDto = userDtoBuilder().byDefault().build();

    userRepositoryMock.register.mockResolvedValueOnce(userBuilder().getNull());

    // Act
    const result = await registerUserUseCase().execute(
      LocaleTypeEnum.EN,
      useCaseTraceBuilder().byDefault(sessionBuilder().byDefault().build()).build(),

      userDto,
    );

    // Assert
    expect(result.success).toBeFalsy();
    expect(result.statusCode).toBe(ApplicationStatus.INTERNAL_ERROR);
    expect(result.error).toBe(appMessages.get(appMessages.keys.ERROR_CREATING_USER));
  });
});
