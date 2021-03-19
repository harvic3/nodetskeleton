import BaseController, { Request, Response, NextFunction } from "../base/BaseController";
import { pongUseCase } from "./container/index";

class HealthController extends BaseController {
  constructor() {
    super();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get("/ping", this.pong);
  }

  pong = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      this.handleResult(res, await pongUseCase.execute());
    } catch (error) {
      next(error);
    }
  };
}

export default new HealthController();
