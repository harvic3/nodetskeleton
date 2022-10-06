import { IUserDto } from "../../../application/modules/users/dtos/User.dto";
import container, { RegisterUserUseCase } from "./container";
import { IServiceContainer } from "../../shared/kernel";
import BaseController, {
  IRequest,
  IResponse,
  INextFunction,
  EntryPointHandler,
  IRouter,
  ServiceContext,
} from "../base/Base.controller";

export class UsersController extends BaseController {
  constructor(serviceContainer: IServiceContainer) {
    super(UsersController.name, serviceContainer, ServiceContext.USERS);
  }

  singUp: EntryPointHandler = async (
    req: IRequest,
    res: IResponse,
    next: INextFunction,
  ): Promise<void> => {
    const userDto = req.body as IUserDto;

    return this.handleResult(
      res,
      next,
      this.servicesContainer
        .get<RegisterUserUseCase>(this.CONTEXT, RegisterUserUseCase.name)
        .execute(req.locale, res.trace, userDto),
    );
  };

  initializeRoutes(router: IRouter): void {
    this.router = router();
    this.router.post("/v1/users/sign-up", this.singUp);
  }
}

export default new UsersController(container);
