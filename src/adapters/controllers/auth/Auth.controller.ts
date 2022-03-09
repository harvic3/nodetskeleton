import container, { LoginUseCase } from "./container";
import BaseController, {
  Request,
  Response,
  NextFunction,
  RequestBase,
  RequestHandler,
  ServiceContext,
  EntryPointHandler,
} from "../base/Base.controller";

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

  protected initializeRoutes(): void {
    this.router.post("/v1/auth/login", this.login as RequestHandler);
  }
}

export default new AuthController();
