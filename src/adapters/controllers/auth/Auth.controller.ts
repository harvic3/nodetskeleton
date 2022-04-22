import { IServiceContainer } from "../../shared/dic/IServiceContainer";
import container, { LoginUseCase } from "./container";
import BaseController, {
  INextFunction,
  EntryPointHandler,
  IRouterType,
  ServiceContext,
  IContext,
} from "../base/Base.controller";

class AuthController extends BaseController {
  constructor(serviceContainer: IServiceContainer) {
    super(serviceContainer, ServiceContext.SECURITY);
  }

  login: EntryPointHandler = async (ctx: IContext, next: INextFunction): Promise<void> => {
    const email = ctx.request.body?.email as string;
    const passwordB64 = ctx.request.body?.password as string;

    return this.handleResult(
      ctx,
      next,
      this.servicesContainer.get<LoginUseCase>(LoginUseCase.name),
      {
        email,
        passwordB64,
      },
    );
  };

  initializeRoutes(router: IRouterType): void {
    this.router = router;
    this.router.post("/v1/auth/login", this.login);
  }
}

export default new AuthController(container);
