const helpDescription = `Serverless TSK available commands:
  - help
  > The next command will create a new function into the project
  - add-use-case 'api-name=<apiName> use-case=<useCaseName> endpoint=<endpoint> http-method=<METHOD>'
  > Example: npm run tsk 'add-use-case api-name=auth use-case=Logout endpoint=/v1/auth/logout http-method=GET'
`;

const importControllerTemplate = "import container, { {{UseCaseName}}UseCase, ";
const functionControllerTemplate = `  {{UseCaseNameCamel}}: EntryPointHandler = async (
    req: IRequest,
    res: IResponse,
    next: INextFunction,
  ): Promise<void> => {
    /*
      Create request data here
      const body = req.body;
    */
    return this.handleResultData(
      res,
      next,
      this.servicesContainer.get<{{UseCaseName}}UseCase>(this.CONTEXT, {{UseCaseName}}UseCase.name).execute(req.locale, res.trace, body),
    );
  };`;
const routerControllerTemplate = `this.router.{{HttpMethodLower}}("{{EndPoint}}", this.{{UseCaseNameCamel}});`;
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
    super({{ApiNameCapitalized}}Controller.name, serviceContainer, ServiceContext.CHANGE_CONTEXT);
  }

  ${functionControllerTemplate}

  initializeRoutes(router: IRouter): void {
    this.router = router();
    ${routerControllerTemplate}
  }
}

export default new {{ApiNameCapitalized}}Controller(container);
`;
const exportContainerTemplate = `export { {{UseCaseName}}UseCase `;
const addUseCaseContainerTemplate = `kernel.addScoped(
  {{UseCaseName}}UseCase.name,
  () =>
    new {{UseCaseName}}UseCase(
      kernel.get<LogProvider>(CONTEXT, LogProvider.name),
    ),
);`;
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

export class {{UseCaseName}}UseCase extends BaseUseCase<WhatType> {
  constructor(
    readonly logProvider: ILogProvider,
  ) {
    super({{UseCaseName}}UseCase.name, logProvider);
  }

  async execute(locale: LocaleTypeEnum, trace: UseCaseTrace, args: WhatType): Promise<IResult> {
    this.setLocale(locale);
    const result = new Result();

    result.setError("Use case must to be implemented", this.applicationStatus.NOT_IMPLEMENTED);

    return result;
  }
}
`;

const templates = {
  controllerTemplate,
  useCaseTemplate,
  controllerContainerTemplate,
  addUseCaseContainerTemplate,
  exportContainerTemplate,
  routerControllerTemplate,
  functionControllerTemplate,
  importControllerTemplate,
};

module.exports = {
  helpDescription,
  templates,
};
