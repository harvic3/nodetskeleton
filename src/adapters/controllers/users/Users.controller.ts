import { IUserDto } from "../../../application/modules/users/dtos/User.dto";
import container, { RegisterUserUseCase } from "./container";
import BaseController, {
  Request,
  Response,
  NextFunction,
  RequestBase,
  RequestHandler,
  ServiceContext,
  EntryPointHandler,
} from "../base/Base.controller";

class UsersController extends BaseController {
  constructor() {
    super(ServiceContext.USERS);
    this.initializeRoutes();
  }

  singUp: EntryPointHandler = async (
    req: Request | RequestBase,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const userDto = req.body as IUserDto;

    return this.handleResult(
      res,
      next,
      container.get<RegisterUserUseCase>(RegisterUserUseCase.name),
      userDto,
    );
  };

  protected initializeRoutes(): void {
    this.router.post("/v1/users/sign-up", this.singUp as RequestHandler);
  }
}

export default new UsersController();
