import { ILogProvider } from "../../../../shared/log/providerContracts/ILogProvider";
import { ApplicationStatus } from "../../../../shared/status/applicationStatus";
import { LocaleTypeEnum } from "../../../../shared/locals/LocaleType.enum";
import { IStatusProvider } from "../../providerContracts/IStatus.provider";
import AppSettings from "../../../../shared/settings/AppSettings";
import Encryption from "../../../../shared/security/encryption";
import appMessages from "../../../../shared/locals/messages";
import appWords from "../../../../shared/locals/words";
import { mock } from "jest-mock-extended";
import { NotFoundUseCase } from "./index";

// Mocks
const logProviderMock = mock<ILogProvider>();
const statusProviderMock = mock<IStatusProvider>();

// Constants
const notFoundUseCase = () => new NotFoundUseCase(logProviderMock, statusProviderMock);
const tokenExpirationTime = 3600;

describe("when try to get a non existing use case", () => {
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

  it("should return a 404 error if the use case doesn't exists", async () => {
    // Act
    const result = await notFoundUseCase().execute(LocaleTypeEnum.EN);

    // Assert
    expect(result.statusCode).toBe(ApplicationStatus.NOT_FOUND);
    expect(result.error).toBe(appMessages.get(appMessages.keys.RESOURCE_NOT_FOUND));
    expect(result.success).toBeFalsy();
  });
});
