import container, { PongUseCase, NotFoundUseCase } from "./container/index";
import { IServiceContainer } from "../../shared/dic/IServiceContainer";
import BaseController, {
  INextFunction,
  EntryPointHandler,
  IRouterType,
  IContext,
} from "../base/Base.controller";

class HealthController extends BaseController {
  constructor(serviceContainer: IServiceContainer) {
    super(serviceContainer);
  }

  pong: EntryPointHandler = async (ctx: IContext, next: INextFunction): Promise<void> => {
    return this.handleResultData(
      ctx,
      next,
      this.serviceContainer.get<PongUseCase>(PongUseCase.name),
    );
  };

  resourceNotFound: EntryPointHandler = async (
    ctx: IContext,
    next: INextFunction,
  ): Promise<void> => {
    return this.handleResult(
      ctx,
      next,
      this.serviceContainer.get<NotFoundUseCase>(NotFoundUseCase.name),
    );
  };

  initializeRoutes(router: IRouterType): void {
    this.router = router;
    this.router.get("/ping", this.pong);
  }
}

export default new HealthController(container);
