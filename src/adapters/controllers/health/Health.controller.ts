import BaseController, {
  Request,
  Response,
  RequestBase,
  NextFunction,
  RequestHandler,
  EntryPointHandler,
} from "../base/Base.controller";
import container, { PongUseCase } from "./container/index";

class HealthController extends BaseController {
  constructor() {
    super();
    this.initializeRoutes();
  }

  pong: EntryPointHandler = async (
    req: Request | RequestBase,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    return this.handleResultData(res, next, container.get<PongUseCase>(PongUseCase.name));
  };

  protected initializeRoutes(): void {
    this.router.get("/ping", this.pong as RequestHandler);
  }
}

export default new HealthController();
