import { IUserDto } from "../../../application/modules/users/dtos/User.dto";
import container, { RegisterUserUseCase } from "./container";
import BaseController, {
  INextFunction,
  EntryPointHandler,
  IRouterType,
  ServiceContext,
  IContext,
} from "../base/Base.controller";

class UsersController extends BaseController {
  constructor() {
    super(ServiceContext.USERS);
  }

  singUp: EntryPointHandler = async (ctx: IContext, next: INextFunction): Promise<void> => {
    const userDto = ctx.request.body as IUserDto;

    return this.handleResult(
      ctx,
      next,
      container.get<RegisterUserUseCase>(RegisterUserUseCase.name),
      userDto,
    );
  };

  initializeRoutes(router: IRouterType): void {
    this.router = router;
    this.router.post("/v1/users/sign-up", this.singUp);
  }
}

export default new UsersController();
