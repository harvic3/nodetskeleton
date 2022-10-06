import container, { PongUseCase, NotFoundUseCase } from "./container/index";
import { IServiceContainer } from "../../shared/kernel";
import BaseController, {
  INextFunction,
  EntryPointHandler,
  IRouter,
  IContext,
} from "../base/Base.controller";

export class HealthController extends BaseController {
  constructor(serviceContainer: IServiceContainer) {
    super(HealthController.name, serviceContainer);
  }

  pong: EntryPointHandler = async (ctx: IContext, next: INextFunction): Promise<void> => {
    return this.handleResultData(
      ctx,
      next,
      this.servicesContainer.get<PongUseCase>(this.CONTEXT, PongUseCase.name).execute(ctx.locale),
    );
  };

  resourceNotFound: EntryPointHandler = async (
    ctx: IContext,
    next: INextFunction,
  ): Promise<void> => {
    return this.handleResult(
      ctx,
      next,
      this.servicesContainer
        .get<NotFoundUseCase>(this.CONTEXT, NotFoundUseCase.name)
        .execute(ctx.locale),
    );
  };

  initializeRoutes(router: IRouter): void {
    this.router = router;
    this.router.get("/ping", this.pong);
  }
}

export default new HealthController(container);
