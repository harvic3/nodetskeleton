import { IUserDto } from "../../../application/modules/users/dtos/User.dto";
import container, { RegisterUserUseCase } from "./container";
import { IServiceContainer } from "../../shared/kernel";
import BaseController, {
  IRequest,
  IResponse,
  INextFunction,
  EntryPointHandler,
  IRouterType,
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
      this.servicesContainer.get<RegisterUserUseCase>(this.CONTEXT, RegisterUserUseCase.name),
      req.locale,
      userDto,
    );
  };

  initializeRoutes(router: IRouterType): void {
    this.router = router();
    this.router.post("/v1/users/sign-up", this.singUp);
  }
}

export default new UsersController(container);
