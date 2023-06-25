import { IServiceContainer } from "../../shared/kernel";
import container, { LoginUseCase } from "./container";
import BaseController, {
  IRequest,
  IResponse,
  INextFunction,
  EntryPointHandler,
  IRouter,
  ServiceContext,
  HttpContentTypeEnum,
  HttpMethodEnum,
  HttpHeaderEnum,
  applicationStatus,
  httpStatus,
} from "../base/Base.controller";

export class AuthController extends BaseController {
  constructor(serviceContainer: IServiceContainer) {
    super(AuthController.name, serviceContainer, ServiceContext.SECURITY);
  }

  login: EntryPointHandler = async (
    req: IRequest,
    res: IResponse,
    next: INextFunction,
  ): Promise<void> => {
    const email = req.body?.email as string;
    const passwordB64 = req.body?.password as string;

    return this.handleResult(
      res,
      next,
      this.servicesContainer
        .get<LoginUseCase>(this.CONTEXT, LoginUseCase.name)
        .execute(req.locale, res.trace, {
          email,
          passwordB64,
        }),
      { [HttpHeaderEnum.CONTENT_TYPE]: HttpContentTypeEnum.APPLICATION_JSON },
    );
  };

  initializeRoutes(router: IRouter): void {
    this.setRouter(router());
    this.addRoute({
      method: HttpMethodEnum.POST,
      path: "/v1/auth/login",
      handlers: [this.login],
      contentType: HttpContentTypeEnum.APPLICATION_JSON,
      produces: [
        {
          applicationStatus: applicationStatus.SUCCESS,
          httpStatus: httpStatus.SUCCESS,
        },
      ],
    });
  }
}

export default new AuthController(container);
