import { ILogProvider } from "../../../../shared/log/providerContracts/ILogProvider";
import { ApplicationErrorMock } from "../../../../mocks/ApplicationError.mock";
import applicationStatus from "../../../../shared/status/applicationStatus";
import { LocaleTypeEnum } from "../../../../shared/locals/LocaleType.enum";
import { UseCaseTraceMock } from "../../../../mocks/UseCaseTrace.mock";
import { SessionMock } from "../../../../mocks/Session.mock";
import appMessages from "../../../../shared/locals/messages";
import appWords from "../../../../shared/locals/words";
import { LogoutUseCase } from "./index";
import { mock } from "jest-mock-extended";
import { ISession } from "../../../../../domain/session/ISession";
import { IAuthProvider } from "../../providerContracts/IAuth.provider";

// Mocks
const logProviderMock = mock<ILogProvider>();
const authProviderMock = mock<IAuthProvider>();

// Builders
const applicationErrorBuilder = new ApplicationErrorMock();
const useCaseTraceBuilder = () => new UseCaseTraceMock();
const sessionBuilder = () => new SessionMock();

// Constants
const useCase = () => new LogoutUseCase(logProviderMock, authProviderMock);

describe("Here your description test", () => {
  beforeAll(() => {
    appMessages.setDefaultLanguage(LocaleTypeEnum.EN);
    appWords.setDefaultLanguage(LocaleTypeEnum.EN);
  });
  beforeEach(() => {});

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
    expect(result.statusCode).toBe(applicationStatus.INVALID_INPUT);
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
    expect(result.statusCode).toBe(applicationStatus.INVALID_INPUT);
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
    expect(result.statusCode).toBe(applicationStatus.SUCCESS);
  });
});
