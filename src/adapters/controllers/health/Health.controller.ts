import container, { PongUseCase } from "./container/index";
import BaseController, {
  EntryPointHandler,
  RequestHandler,
  NextFunction,
  RequestBase,
  Response,
  Request,
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

  protected initializeRoutes(): void {
    this.router.get("/ping", this.pong as RequestHandler);
  }
}

export default new HealthController();
