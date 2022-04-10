import container, { PongUseCase, NotFoundUseCase } from "./container/index";
import BaseController, {
  Request,
  Response,
  RequestBase,
  NextFunction,
  RequestHandler,
  EntryPointHandler,
} from "../base/Base.controller";

class HealthController extends BaseController {
  constructor() {
    super();
    this.initializeRoutes();
  }

  pong: EntryPointHandler = async (
    _req: Request | RequestBase,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    return this.handleResultData(res, next, container.get<PongUseCase>(PongUseCase.name));
  };

  resourceNotFound: EntryPointHandler = async (
    _req: Request | RequestBase,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    return this.handleResult(res, next, container.get<NotFoundUseCase>(NotFoundUseCase.name));
  };

  protected initializeRoutes(): void {
    this.router.get("/ping", this.pong as RequestHandler);
  }
}

export default new HealthController();
