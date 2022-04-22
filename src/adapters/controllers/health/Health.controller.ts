import container, { PongUseCase, NotFoundUseCase } from "./container/index";
import { IServiceContainer } from "../../shared/dic/IServiceContainer";
import BaseController, {
  IRequest,
  IResponse,
  INextFunction,
  EntryPointHandler,
  IRouterType,
} from "../base/Base.controller";

class HealthController extends BaseController {
  constructor(serviceContainer: IServiceContainer) {
    super(serviceContainer);
  }

  pong: EntryPointHandler = async (
    _req: IRequest,
    res: IResponse,
    next: INextFunction,
  ): Promise<void> => {
    return this.handleResultData(
      res,
      next,
      this.servicesContainer.get<PongUseCase>(PongUseCase.name),
    );
  };

  resourceNotFound: EntryPointHandler = async (
    _req: IRequest,
    res: IResponse,
    next: INextFunction,
  ): Promise<void> => {
    return this.handleResult(
      res,
      next,
      this.servicesContainer.get<NotFoundUseCase>(NotFoundUseCase.name),
    );
  };

  initializeRoutes(router: IRouterType): void {
    this.router = router();
    this.router.get("/ping", this.pong);
  }
}

export default new HealthController(container);
