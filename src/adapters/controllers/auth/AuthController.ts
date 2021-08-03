import { RegisterUserUseCase } from "../../../application/modules/users/useCases/register";
import BaseController, { Request, Response, NextFunction } from "../base/BaseController";
import { LoginUseCase } from "../../../application/modules/auth/useCases/login";
import { User } from "../../../domain/user/User";
import container from "./container";

export class AuthController extends BaseController {
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

  private initializeRoutes(): void {
    this.router.post("/v1/users/login", this.login);
    this.router.post("/v1/users/sign-up", this.singUp);
  }
}

export default new AuthController();
