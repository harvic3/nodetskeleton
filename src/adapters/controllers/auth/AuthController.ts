import { User } from "../../../domain/user/User";
import BaseController, { Request, Response, NextFunction } from "../base/BaseController";
import { loginUseCase, registerUseCase } from "./container";

export class AuthController extends BaseController {
  constructor() {
    super();
    this.initializeRoutes();
  }

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const email = req.body?.email as string;
      const passwordB64 = req.body.password as string;

      this.handleResult(res, await loginUseCase.execute(email, passwordB64));
    } catch (error) {
      next(error);
    }
  };

  singUp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user: User = req.body;

      this.handleResult(res, await registerUseCase.execute(user));
    } catch (error) {
      next(error);
    }
  };

  private initializeRoutes(): void {
    this.router.post("/v1/users/login", this.login);
    this.router.post("/v1/users/sign-up", this.singUp);
  }
}

export default new AuthController();
