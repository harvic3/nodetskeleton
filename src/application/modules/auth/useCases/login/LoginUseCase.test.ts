import { mock } from "jest-mock-extended";
import resources, { resourceKeys } from "../../../../shared/locals/messages";
import { IAuthProvider } from "../../providerContracts/IAuthProvider";
import { LoginUseCase } from "./index";
import * as applicationStatusCodes from "../../../../shared/status/applicationStatusCodes.json";
import words from "../../../../shared/locals/words";
import { UserMock } from "../../../../mocks/User.mock";
import { TokenDto } from "../../dtos/TokenDto";
import AppSettings from "../../../../shared/settings/AppSettings";

const defaultLanguage = "en";
const tokenExpirationTime = 3600;

const authProviderMock = mock<IAuthProvider>();
const loginUseCase = new LoginUseCase(authProviderMock);

const email = "nikolatesla@elion.com";
const password = 
  "TGEgdmlkYSBlcyB0b2RvIGVzbyBxdWUgc2UgcGFzYSBtaWVudHJhcyB0dSBleGlzdGVuY2lhIHNlIHZhIGVuIHVuIGVzY3JpdG9yaW8gZGV0csOhcyBkZSB1biBjb21wdXRhZG9yLg==";

describe("when try to login", () => {
  beforeAll(() => {
    resources.setDefaultLanguage(defaultLanguage);
    words.setDefaultLanguage(defaultLanguage);
    AppSettings.JWTExpirationTime = tokenExpirationTime;
  });
  beforeEach(() => {
    authProviderMock.login.mockReset();
  });
  it("should return a 400 error if email and password are null", async () => {
    // Act
    const result = await loginUseCase.execute(null, null);

    // Assert
    expect(result.statusCode).toBe(applicationStatusCodes.BAD_REQUEST);
    expect(result.error).toBe(
      resources.getWithParams(resourceKeys.SOME_PARAMETERS_ARE_MISSING, {
        missingParams: "Email, Password",
      }),
    );
    expect(result.success).toBeFalsy();
  });
  it("should return a 400 error if password is null", async () => {
    // Act
    const result = await loginUseCase.execute(email, null);

    // Assert
    expect(result.statusCode).toBe(applicationStatusCodes.BAD_REQUEST);
    expect(result.error).toBe(
      resources.getWithParams(resourceKeys.SOME_PARAMETERS_ARE_MISSING, {
        missingParams: "Password",
      }),
    );
    expect(result.success).toBeFalsy();
  });
  it("should return a 400 error if email or password was invalid", async () => {
    // Arrange
    authProviderMock.login.mockRejectedValueOnce(null);

    // Act
    const result = await loginUseCase.execute(email, password);

    // Assert
    expect(result.statusCode).toBe(applicationStatusCodes.BAD_REQUEST);
    expect(result.error).toBe(resources.get(resourceKeys.INVALID_USER_OR_PASSWORD));
    expect(result.success).toBeFalsy();
  });
  it("should return a 400 error if email or password was invalid", async () => {
    // Arrange
    authProviderMock.login.mockRejectedValueOnce(null);

    // Act
    const result = await loginUseCase.execute(email, password);

    // Assert
    expect(result.statusCode).toBe(applicationStatusCodes.BAD_REQUEST);
    expect(result.error).toBe(resources.get(resourceKeys.INVALID_USER_OR_PASSWORD));
    expect(result.success).toBeFalsy();
  });
  it("should return a session response if user and password are valid", async () => {
    // Arrange
    const user = new UserMock().withEmail().withName().withGender().build();
    authProviderMock.login.mockResolvedValueOnce(user);
    authProviderMock.getJwt.mockResolvedValueOnce(password);

    // Act
    const result = await loginUseCase.execute(email, password);

    // Assert
    const data = result.data as TokenDto;
    expect(result.statusCode).toBe(applicationStatusCodes.SUCCESS);
    expect(result.success).toBeTruthy();
    expect(data.expireIn).toBe(tokenExpirationTime);
  });
});
