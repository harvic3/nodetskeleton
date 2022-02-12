import BaseController, { Request, Response, NextFunction } from "../base/Base.controller";
import container, { PongUseCase } from "./container/index";

class HealthController extends BaseController {
  constructor() {
    super();
    this.initializeRoutes();
  }

  pong = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    return this.handleResultData(res, next, container.get<PongUseCase>(PongUseCase.name));
  };

  protected initializeRoutes(): void {
    this.router.get("/ping", this.pong);
  }
}

export default new HealthController();
