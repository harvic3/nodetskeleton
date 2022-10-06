import { IUserDto } from "../../../application/modules/users/dtos/User.dto";
import container, { RegisterUserUseCase } from "./container";
import { IServiceContainer } from "../../shared/kernel";
import BaseController, {
  INextFunction,
  EntryPointHandler,
  IRouter,
  ServiceContext,
  IContext,
} from "../base/Base.controller";

export class UsersController extends BaseController {
  constructor(serviceContainer: IServiceContainer) {
    super(UsersController.name, serviceContainer, ServiceContext.USERS);
  }

  singUp: EntryPointHandler = async (ctx: IContext, next: INextFunction): Promise<void> => {
    const userDto = ctx.request.body as IUserDto;

    return this.handleResult(
      ctx,
      next,
      this.servicesContainer
        .get<RegisterUserUseCase>(this.CONTEXT, RegisterUserUseCase.name)
        .execute(ctx.locale, ctx.trace, userDto),
    );
  };

  initializeRoutes(router: IRouter): void {
    this.router = router;
    this.router.post("/v1/users/sign-up", this.singUp);
  }
}

export default new UsersController(container);
