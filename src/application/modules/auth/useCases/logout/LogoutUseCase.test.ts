import { ILogProvider } from "../../../../shared/log/providerContracts/ILogProvider";
import { ApplicationStatus } from "../../../../shared/status/applicationStatus";
import { LocaleTypeEnum } from "../../../../shared/locals/LocaleType.enum";
import { UseCaseTraceMock } from "../../../../mocks/UseCaseTrace.mock";
import { IAuthProvider } from "../../providerContracts/IAuth.provider";
import { ISession } from "../../../../../domain/session/ISession";
import { SessionMock } from "../../../../mocks/Session.mock";
import appMessages from "../../../../shared/locals/messages";
import appWords from "../../../../shared/locals/words";
import { mock } from "jest-mock-extended";
import { LogoutUseCase } from "./index";

// Mocks
const logProviderMock = mock<ILogProvider>();
const authProviderMock = mock<IAuthProvider>();

// Builders
const useCaseTraceBuilder = () => new UseCaseTraceMock();
const sessionBuilder = () => new SessionMock();

// Constants
const useCase = () => new LogoutUseCase(logProviderMock, authProviderMock);

describe("when try to logout", () => {
  beforeAll(() => {
    appMessages.setDefaultLanguage(LocaleTypeEnum.EN);
    appWords.setDefaultLanguage(LocaleTypeEnum.EN);
  });
  beforeEach(() => {
    authProviderMock.registerLogout.mockReset();
  });

  it("should return a 400 error if the session is invalid", async () => {
    // Arrange
    const session: ISession = {} as any;

    // Act
    const result = await useCase().execute(
      LocaleTypeEnum.EN,
      useCaseTraceBuilder().byDefault(sessionBuilder().byDefault().build()).build(),
      { session },
    );

    // Assert
    expect(result.success).toBeFalsy();
    expect(result.statusCode).toBe(ApplicationStatus.INVALID_INPUT);
  });

  it("should return a 400 error if the session is null", async () => {
    // Arrange
    const session: any = null;

    // Act
    const result = await useCase().execute(
      LocaleTypeEnum.EN,
      useCaseTraceBuilder().byDefault(sessionBuilder().byDefault().build()).build(),
      { session },
    );

    // Assert
    expect(result.success).toBeFalsy();
    expect(result.statusCode).toBe(ApplicationStatus.INVALID_INPUT);
  });

  it("should return a 200 error if the session is valid", async () => {
    // Arrange
    const session: ISession = { exp: Date.now(), sessionId: "123" } as any;

    // Act
    const result = await useCase().execute(
      LocaleTypeEnum.EN,
      useCaseTraceBuilder().byDefault(sessionBuilder().byDefault().build()).build(),
      { session },
    );

    // Assert
    expect(result.success).toBeTruthy();
    expect(result.statusCode).toBe(ApplicationStatus.SUCCESS);
  });

  it("should return a 400 error if the user in session is invalid", async () => {
    // Arrange
    const session: ISession = { exp: Date.now(), sessionId: "123" } as any;
    authProviderMock.registerLogout.mockRejectedValueOnce(new Error("erro mock"));

    // Act
    const result = await useCase().execute(
      LocaleTypeEnum.EN,
      useCaseTraceBuilder().byDefault(sessionBuilder().byDefault().build()).build(),
      { session },
    );

    // Assert
    expect(result.success).toBeFalsy();
    expect(result.statusCode).toBe(ApplicationStatus.INVALID_INPUT);
  });
});
