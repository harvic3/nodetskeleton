import { ILogProvider } from "../../../../shared/log/providerContracts/ILogProvider";
import { ApplicationStatus } from "../../../../shared/status/applicationStatus";
import { LocaleTypeEnum } from "../../../../shared/locals/LocaleType.enum";
import { IStatusProvider } from "../../providerContracts/IStatus.provider";
import AppSettings from "../../../../shared/settings/AppSettings";
import Encryption from "../../../../shared/security/encryption";
import appMessages from "../../../../shared/locals/messages";
import appWords from "../../../../shared/locals/words";
import { mock } from "jest-mock-extended";
import { PongUseCase } from "./index";

// Mocks
const logProviderMock = mock<ILogProvider>();
const statusProviderMock = mock<IStatusProvider>();

// Constants
const pongUseCase = () => new PongUseCase(logProviderMock, statusProviderMock);
const tokenExpirationTime = 3600;

describe("when try to get the api status", () => {
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

  it("should return a 200 pong result", async () => {
    // Act
    const result = await pongUseCase().execute(LocaleTypeEnum.EN);

    // Assert
    expect(result.statusCode).toBe(ApplicationStatus.SUCCESS);
    expect(result.success).toBeTruthy();
  });
});
