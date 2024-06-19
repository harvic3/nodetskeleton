import { ILogProvider } from "../../../../shared/log/providerContracts/ILogProvider";
import applicationStatus from "../../../../shared/status/applicationStatus";
import { LocaleTypeEnum } from "../../../../shared/locals/LocaleType.enum";
import AppSettings from "../../../../shared/settings/AppSettings";
import Encryption from "../../../../shared/security/encryption";
import appMessages from "../../../../shared/locals/messages";
import appWords from "../../../../shared/locals/words";
import { mock } from "jest-mock-extended";
import { NotFoundUseCase } from "./index";
import { IStatusProvider } from "../../providerContracts/IStatus.provider";

// Mocks
const logProviderMock = mock<ILogProvider>();
const statusProviderMock = mock<IStatusProvider>();

// Constants
const notFoundUseCase = () => new NotFoundUseCase(logProviderMock, statusProviderMock);
const tokenExpirationTime = 3600;

describe("when try to login", () => {
  beforeAll(() => {
    appMessages.setDefaultLanguage(LocaleTypeEnum.EN);
    appWords.setDefaultLanguage(LocaleTypeEnum.EN);
    AppSettings.JWTExpirationTime = tokenExpirationTime;
    AppSettings.EncryptionKey = "hello-alien";
    AppSettings.EncryptionIterations = 1e3;
    AppSettings.EncryptionKeySize = 64;
    Encryption.init(
      AppSettings.EncryptionKey,
      AppSettings.EncryptionIterations,
      AppSettings.EncryptionKeySize,
    );
  });
  beforeEach(() => {
    statusProviderMock.get.mockReset();
  });

  it("should return a 400 error if email and password are null", async () => {
    // Act
    const result = await notFoundUseCase().execute(LocaleTypeEnum.EN);

    // Assert
    expect(result.statusCode).toBe(applicationStatus.NOT_FOUND);
    expect(result.error).toBe(appMessages.get(appMessages.keys.RESOURCE_NOT_FOUND));
    expect(result.success).toBeFalsy();
  });
});
