import resources, { resourceKeys } from "../../../../shared/locals/messages";
import applicationStatus from "../../../../shared/status/applicationStatus";
import { IUSerRepository } from "../../providerContracts/IUser.repository";
import Encryptor from "../../../../shared/security/encryption/Encryptor";
import AppSettings from "../../../../shared/settings/AppSettings";
import words, { wordKeys } from "../../../../shared/locals/words";
import { UserMock } from "../../../../mocks/User.mock";
import { User } from "../../../../../domain/user/User";
import { RegisterUserUseCase } from "./index";
import { mock } from "jest-mock-extended";

const defaultLanguage = "en";

const userRepositoryMock = mock<IUSerRepository>();
const registerUserUseCase = () => new RegisterUserUseCase(userRepositoryMock);

describe("when try to register user", () => {
  beforeAll(() => {
    resources.setDefaultLanguage(defaultLanguage);
    words.setDefaultLanguage(defaultLanguage);
    AppSettings.EncryptionKey = "hello-alien";
  });
  beforeEach(() => {
    userRepositoryMock.register.mockReset();
    userRepositoryMock.getByEmail.mockReset();
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
    const user = new UserMock().withName().withEmail().withGender().build();
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
    const user = new UserMock().withName().withEmail().withGender().withPassword().build();
    const userWithSameEmail = new UserMock()
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
        email: user.email,
      }),
    );
  });
  it("should return a 500 error if Encryptor tool has not been initialized", async () => {
    // Arrange
    const user = new UserMock().withName().withEmail().withGender().withPassword().build();
    userRepositoryMock.getByEmail.mockResolvedValueOnce(null);
    userRepositoryMock.register.mockResolvedValueOnce(user);
    // Act
    const result = registerUserUseCase().execute(user);
    // Assert
    expect(result).rejects.toThrowError(
      resources.getWithParams(resourceKeys.TOOL_HAS_NOT_BEEN_INITIALIZED, {
        toolName: words.get(wordKeys.ENCRYPTOR),
      }),
    );
  });
  it("should return a success if user was registered", async () => {
    // Arrange
    Encryptor.init(AppSettings.EncryptionKey);
    const user = new UserMock().withName().withEmail().withGender().withPassword().build();
    userRepositoryMock.getByEmail.mockResolvedValueOnce(null);
    userRepositoryMock.register.mockResolvedValueOnce(user);
    // Act
    const result = await registerUserUseCase().execute(user);
    // Assert
    expect(result.success).toBeTruthy();
    expect(result.statusCode).toBe(applicationStatus.SUCCESS);
    expect(result.message).toBe(resources.get(resourceKeys.USER_WAS_CREATED));
  });
});
