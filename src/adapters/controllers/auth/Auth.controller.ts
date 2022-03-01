import container, { LoginUseCase, RegisterUserUseCase } from "./container";
import { User } from "../../../domain/user/User";
import BaseController, {
  Request,
  Response,
  NextFunction,
  RequestBase,
  RequestHandler,
  EntryPointHandler,
} from "../base/Base.controller";
import { Email } from "../../../domain/user/Email";

class AuthController extends BaseController {
  constructor() {
    super();
    this.initializeRoutes();
  }

  login: EntryPointHandler = async (
    req: Request | RequestBase,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const email = req.body?.email as string;
    const passwordB64 = req.body?.password as string;

    return this.handleResult(res, next, container.get<LoginUseCase>(LoginUseCase.name), {
      email,
      passwordB64,
    });
  };

  singUp: EntryPointHandler = async (
    req: Request | RequestBase,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const email = req.body?.email as string;
    const user: User = req.body;
    user.email = new Email(email?.toLowerCase());

    return this.handleResult(
      res,
      next,
      container.get<RegisterUserUseCase>(RegisterUserUseCase.name),
      user,
    );
  };

  protected initializeRoutes(): void {
    this.router.post("/v1/users/login", this.login as RequestHandler);
    this.router.post("/v1/users/sign-up", this.singUp as RequestHandler);
  }
}

export default new AuthController();
