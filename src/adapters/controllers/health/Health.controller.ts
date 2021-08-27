import BaseController, { Request, Response, NextFunction } from "../base/Base.controller";
import container, { PongUseCase } from "./container/index";

class HealthController extends BaseController {
  constructor() {
    super();
    this.initializeRoutes();
  }

  pong = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      this.handleResultData(res, await container.get<PongUseCase>(PongUseCase.name).execute());
    } catch (error) {
      next(error);
    }
  };

  protected initializeRoutes(): void {
    this.router.get("/ping", this.pong);
  }
}

export default new HealthController();
