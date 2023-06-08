const helpDescription = `Serverless TSK available commands:
  - add-use-case 'api-name=<apiName> use-case=<useCaseName> endpoint=<endpoint> http-method=<METHOD>'
    > The previous command will create a new UseCase into the project. Arguments can be sent in any order.
    > Example: npm run tsk 'add-use-case api-name=auth use-case=Logout endpoint=/v1/auth/logout http-method=GET'

  - alias 'arg=<argName>'
    > The previous command will show available aliases for the sended argument name
    > Example: npm run tsk 'alias arg=api-name'
`;

const importControllerTemplate = "import container, { {{UseCaseName}}UseCase, ";
const functionControllerTemplate = `
  {{UseCaseNameCamel}}: EntryPointHandler = async (
    req: IRequest,
    res: IResponse,
    next: INextFunction,
  ): Promise<void> => {
    // Create your request data from body, query or params here
    const body = req.body;
    return this.handleResultData(
      res,
      next,
      this.servicesContainer.get<{{UseCaseName}}UseCase>(this.CONTEXT, {{UseCaseName}}UseCase.name).execute(req.locale, res.trace, body),
    );
  };
`;
const routerControllerTemplate = `    this.router.{{HttpMethodLower}}("{{EndPoint}}", this.{{UseCaseNameCamel}});`;
const controllerTemplate = `${importControllerTemplate} } from "./container/index";
import { IServiceContainer } from "../../shared/kernel";
import BaseController, {
  IRouter,
  IRequest,
  IResponse,
  INextFunction,
  ServiceContext,
  EntryPointHandler,
} from "../base/Base.controller";

export class {{ApiNameCapitalized}}Controller extends BaseController {
  constructor(serviceContainer: IServiceContainer) {
    super({{ApiNameCapitalized}}Controller.name, serviceContainer, ServiceContext.{{ApiNameUpper}});
  }
  ${functionControllerTemplate}
  initializeRoutes(router: IRouter): void {
    this.router = router();
${routerControllerTemplate}
  }
}

export default new {{ApiNameCapitalized}}Controller(container);
`;
const importContainerTemplate = `import { {{UseCaseName}}UseCase } from "../../../../application/modules/{{ApiName}}/useCases/{{ActionName}}";`;
const exportContainerTemplate = `export { {{UseCaseName}}UseCase `;
const addUseCaseContainerTemplate = `
kernel.addScoped(
  {{UseCaseName}}UseCase.name,
  () =>
    new {{UseCaseName}}UseCase(
      kernel.get<LogProvider>(CONTEXT, LogProvider.name),
    ),
);
`;
const controllerContainerTemplate = `import { {{UseCaseName}}UseCase } from "../../../../application/modules/{{ApiName}}/useCases/{{ActionName}}";
import { LogProvider } from "../../../providers/container";
import kernel from "../../../shared/kernel";

const CONTEXT = "{{ApiNameCapitalized}}ControllerContainer";
${addUseCaseContainerTemplate}
${exportContainerTemplate} };
export default kernel;
`;
const useCaseTemplate = `import { BaseUseCase, IResult, Result } from "../../../../shared/useCase/BaseUseCase";
import { ILogProvider } from "../../../../shared/log/providerContracts/ILogProvider";
import { LocaleTypeEnum } from "../../../../shared/locals/LocaleType.enum";
import { UseCaseTrace } from "../../../../shared/log/UseCaseTrace";

//TODO: Change this input generic type BaseUseCase<unknown> according input of your use case
export class {{UseCaseName}}UseCase extends BaseUseCase<unknown> {
  constructor(
    readonly logProvider: ILogProvider,
  ) {
    super({{UseCaseName}}UseCase.name, logProvider);
  }

  async execute(locale: LocaleTypeEnum, trace: UseCaseTrace, args: unknown): Promise<IResult> {
    this.setLocale(locale);
    const result = new Result();

    result.setError("Use case must to be implemented", this.applicationStatus.NOT_IMPLEMENTED);

    return result;
  }
}
`;
const testUseCaseTemplate = `import { ILogProvider } from "../../../../shared/log/providerContracts/ILogProvider";
import { ApplicationErrorMock } from "../../../../mocks/ApplicationError.mock";
import applicationStatus from "../../../../shared/status/applicationStatus";
import { LocaleTypeEnum } from "../../../../shared/locals/LocaleType.enum";
import { UseCaseTraceMock } from "../../../../mocks/UseCaseTrace.mock";
import { SessionMock } from "../../../../mocks/Session.mock";
import appMessages from "../../../../shared/locals/messages";
import appWords from "../../../../shared/locals/words";
import { {{UseCaseName}}UseCase } from "./index";
import { mock } from "jest-mock-extended";

// Mocks
const logProviderMock = mock<ILogProvider>();

// Builders
const applicationErrorBuilder = new ApplicationErrorMock();
const useCaseTraceBuilder = () => new UseCaseTraceMock();
const sessionBuilder = () => new SessionMock();

// Constants
const useCase = () => new {{UseCaseName}}UseCase(logProviderMock);

describe("Here your description test", () => {
  beforeAll(() => {
    appMessages.setDefaultLanguage(LocaleTypeEnum.EN);
    appWords.setDefaultLanguage(LocaleTypeEnum.EN);
  });
  beforeEach(() => {
  });

  it("And here your first test", async () => {
    // Arrange
    const body = null;

    // Act
    const result = await useCase().execute(
      LocaleTypeEnum.EN,
      useCaseTraceBuilder().byDefault(sessionBuilder().byDefault().build()).build(),
      body,
    );

    // Assert
    expect(result.success).toBeFalsy();
    expect(result.statusCode).toBe(applicationStatus.INVALID_INPUT);
  });
});
`;

const templates = {
  controllerTemplate,
  useCaseTemplate,
  controllerContainerTemplate,
  addUseCaseContainerTemplate,
  importContainerTemplate,
  exportContainerTemplate,
  routerControllerTemplate,
  functionControllerTemplate,
  importControllerTemplate,
  testUseCaseTemplate,
};

module.exports = {
  helpDescription,
  templates,
};
