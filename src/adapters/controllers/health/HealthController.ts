// For KoaJs
// import BaseController, { Context } from "../BaseController";
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
//     this.HandleResult(context, await pongUseCase.Execute());
//   };
// }

// const instance = new HealthController();

// export default instance;

// For ExpressJs
import BaseController, { Request, Response, NextFunction } from "../BaseController";
import { pongUseCase } from "./container/index";

class HealthController extends BaseController {
  constructor() {
    super();
    this.InitializeRoutes();
  }
  private InitializeRoutes(): void {
    this.router.get("/ping", this.Pong);
  }
  Pong = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      this.HandleResult(res, await pongUseCase.Execute());
    } catch (error) {
      next(error);
    }
  };
}

const instance = new HealthController();

export default instance;
