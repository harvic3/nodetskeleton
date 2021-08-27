import BaseController, { Request, Response, NextFunction } from "../base/Base.controller";
import { User } from "../../../domain/user/User";
import container, { LoginUseCase, RegisterUserUseCase } from "./container";

class AuthController extends BaseController {
  constructor() {
    super();
    this.initializeRoutes();
  }

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const email = req.body?.email as string;
      const passwordB64 = req.body?.password as string;

      this.handleResult(
        res,
        await container.get<LoginUseCase>(LoginUseCase.name).execute({
          email,
          passwordB64,
        }),
      );
    } catch (error) {
      next(error);
    }
  };

  singUp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user: User = req.body;

      this.handleResult(
        res,
        await container.get<RegisterUserUseCase>(RegisterUserUseCase.name).execute(user),
      );
    } catch (error) {
      next(error);
    }
  };

  protected initializeRoutes(): void {
    this.router.post("/v1/users/login", this.login);
    this.router.post("/v1/users/sign-up", this.singUp);
  }
}

export default new AuthController();
