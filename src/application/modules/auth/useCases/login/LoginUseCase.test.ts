import { ILogProvider } from "../../../../shared/log/providerContracts/ILogProvider";
import resources, { resourceKeys } from "../../../../shared/locals/messages";
import applicationStatus from "../../../../shared/status/applicationStatus";
import { LocaleTypeEnum } from "../../../../shared/locals/LocaleType.enum";
import { StringUtil } from "../../../../../domain/shared/utils/StringUtil";
import { IAuthProvider } from "../../providerContracts/IAuth.provider";
import words, { wordKeys } from "../../../../shared/locals/words";
import AppSettings from "../../../../shared/settings/AppSettings";
import { UserMock } from "../../../../mocks/User.mock";
import { TokenDto } from "../../dtos/TokenDto";
import { mock } from "jest-mock-extended";
import { LoginUseCase } from "./index";

// Mocks
const logProviderMock = mock<ILogProvider>();
const authProviderMock = mock<IAuthProvider>();

// Constants
const loginUseCase = () => new LoginUseCase(logProviderMock, authProviderMock);
const email = "nikolatesla@elion.com";
const passwordB64 = StringUtil.encodeBase64("HelloWorld8+");
const jwt =
  "TGEgdmlkYSBlcyB0b2RvIGVzbyBxdWUgc2UgcGFzYSBtaWVudHJhcyB0dSBleGlzdGVuY2lhIHNlIHZhIGVuIHVuIGVzY3JpdG9yaW8gZGV0csOhcyBkZSB1biBjb21wdXRhZG9yLg==";
const tokenExpirationTime = 3600;

describe("when try to login", () => {
  beforeAll(() => {
    resources.setDefaultLanguage(LocaleTypeEnum.EN);
    words.setDefaultLanguage(LocaleTypeEnum.EN);
    AppSettings.JWTExpirationTime = tokenExpirationTime;
    AppSettings.EncryptionKey = "hello-alien";
    AppSettings.EncryptionIterations = 1e3;
    AppSettings.EncryptionKeySize = 64;
  });
  beforeEach(() => {
    authProviderMock.login.mockReset();
  });

  it("should return a 400 error if email and password are null", async () => {
    // Act
    const result = await loginUseCase().execute({ email: undefined, passwordB64: undefined });

    // Assert
    expect(result.statusCode).toBe(applicationStatus.INVALID_INPUT);
    expect(result.error).toBe(
      resources.getWithParams(resourceKeys.SOME_PARAMETERS_ARE_MISSING, {
        missingParams: `${words.get(wordKeys.EMAIL)}, ${words.get(wordKeys.PASSWORD)}`,
      }),
    );
    expect(result.success).toBeFalsy();
  });
  it("should return a 400 error if password is null", async () => {
    // Act
    const result = await loginUseCase().execute({ email, passwordB64: undefined });

    // Assert
    expect(result.statusCode).toBe(applicationStatus.INVALID_INPUT);
    expect(result.error).toBe(
      resources.getWithParams(resourceKeys.SOME_PARAMETERS_ARE_MISSING, {
        missingParams: words.get(wordKeys.PASSWORD),
      }),
    );
    expect(result.success).toBeFalsy();
  });
  it("should return a 400 error if email or password was invalid", async () => {
    // Arrange
    authProviderMock.login.mockRejectedValueOnce(null);

    // Act
    const result = await loginUseCase().execute({ email, passwordB64 });

    // Assert
    expect(result.statusCode).toBe(applicationStatus.INVALID_INPUT);
    expect(result.error).toBe(resources.get(resourceKeys.INVALID_USER_OR_PASSWORD));
    expect(result.success).toBeFalsy();
  });
  it("should return a 400 error if email or password was invalid", async () => {
    // Arrange
    authProviderMock.login.mockRejectedValueOnce(null);

    // Act
    const result = await loginUseCase().execute({ email, passwordB64 });

    // Assert
    expect(result.statusCode).toBe(applicationStatus.INVALID_INPUT);
    expect(result.error).toBe(resources.get(resourceKeys.INVALID_USER_OR_PASSWORD));
    expect(result.success).toBeFalsy();
  });
  it("should return a session response if user and password are valid", async () => {
    // Arrange
    const user = new UserMock().withEmail().withName().withGender().build();
    authProviderMock.login.mockResolvedValueOnce(user);
    authProviderMock.getJwt.mockResolvedValueOnce(jwt);

    // Act
    const result = await loginUseCase().execute({ email, passwordB64 });

    // Assert
    const data = result.data as TokenDto;
    expect(result.statusCode).toBe(applicationStatus.SUCCESS);
    expect(result.success).toBeTruthy();
    expect(data.expiresIn).toBe(tokenExpirationTime);
  });
});
