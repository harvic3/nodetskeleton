import container, { PongUseCase, NotFoundUseCase } from "./container/index";
import { IServiceContainer } from "../../shared/kernel";
import BaseController, {
  IRouter,
  IRequest,
  IResponse,
  INextFunction,
  EntryPointHandler,
} from "../base/Base.controller";

export class StatusController extends BaseController {
  constructor(serviceContainer: IServiceContainer) {
    super(StatusController.name, serviceContainer);
  }

  pong: EntryPointHandler = async (
    req: IRequest,
    res: IResponse,
    next: INextFunction,
  ): Promise<void> => {
    return this.handleResultData(
      res,
      next,
      this.servicesContainer.get<PongUseCase>(this.CONTEXT, PongUseCase.name).execute(req.locale),
    );
  };

  resourceNotFound: EntryPointHandler = async (
    req: IRequest,
    res: IResponse,
    next: INextFunction,
  ): Promise<void> => {
    return this.handleResult(
      res,
      next,
      this.servicesContainer
        .get<NotFoundUseCase>(this.CONTEXT, NotFoundUseCase.name)
        .execute(req.locale),
    );
  };

  initializeRoutes(router: IRouter): void {
    this.router = router();
    this.router.get("/ping", this.pong);
  }
}

export default new StatusController(container);
