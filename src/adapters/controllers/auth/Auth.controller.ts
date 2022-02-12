import BaseController, { Request, Response, NextFunction } from "../base/Base.controller";
import container, { LoginUseCase, RegisterUserUseCase } from "./container";
import { User } from "../../../domain/user/User";

class AuthController extends BaseController {
  constructor() {
    super();
    this.initializeRoutes();
  }

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const email = req.body?.email as string;
    const passwordB64 = req.body?.password as string;

    return this.handleResult(res, next, container.get<LoginUseCase>(LoginUseCase.name), {
      email,
      passwordB64,
    });
  };

  singUp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const user: User = req.body;

    return this.handleResult(
      res,
      next,
      container.get<RegisterUserUseCase>(RegisterUserUseCase.name),
      user,
    );
  };

  protected initializeRoutes(): void {
    this.router.post("/v1/users/login", this.login);
    this.router.post("/v1/users/sign-up", this.singUp);
  }
}

export default new AuthController();
