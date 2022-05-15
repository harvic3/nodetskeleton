import { IServiceContainer } from "../../shared/dic/IServiceContainer";
import container, { LoginUseCase } from "./container";

import BaseController, {
  IRequest,
  IResponse,
  INextFunction,
  EntryPointHandler,
  IRouterType,
  ServiceContext,
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
      this.servicesContainer.get<LoginUseCase>(this.CONTEXT, LoginUseCase.name),
      {
        email,
        passwordB64,
      },
    );
  };

  initializeRoutes(router: IRouterType): void {
    this.router = router();
    this.router.post("/v1/auth/login", this.login);
  }
}

export default new AuthController(container);
