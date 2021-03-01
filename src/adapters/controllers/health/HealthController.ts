// For KoaJs
// import BaseController, { Context } from "../base/BaseController";
// import { pongUseCase } from "./container/index";

// class HealthController extends BaseController {
//   constructor() {
//     super();
//     this.InitializeRoutes();
//   }
//   private InitializeRoutes(): void {
//     this.router.get("/ping", this.Pong);
//   }
//   Pong = async (context: Context): Promise<void> => {
//     this.HandleResult(context, await pongUseCase.execute());
//   };
// }

// const instance = new HealthController();

// export default instance;

// For ExpressJs
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

const instance = new HealthController();

export default instance;
