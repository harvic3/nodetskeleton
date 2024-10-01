import { PropTypeEnum, ResultDescriber, TypeDescriber } from "../base/context/apiDoc/TypeDescriber";
import { IUserDto, UserDto } from "../../../application/modules/users/dtos/User.dto";
import container, { RegisterUserUseCase } from "./container";
import { IServiceContainer } from "../../shared/kernel";
import BaseController, {
  IRequest,
  IResponse,
  INextFunction,
  RequestHandler,
  IRouter,
  ServiceContext,
  HttpContentTypeEnum,
  HttpMethodEnum,
  ApplicationStatus,
  HttpStatusEnum,
} from "../base/Base.controller";

export class UsersController extends BaseController {
  constructor(serviceContainer: IServiceContainer) {
    super(UsersController.name, serviceContainer, ServiceContext.USERS);
  }

  singUp: RequestHandler = async (
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
    this.setRouter(router());
    this.addRoute({
      method: HttpMethodEnum.POST,
      path: "/v1/users/sign-up",
      handlers: [this.singUp],
      produces: [
        {
          applicationStatus: ApplicationStatus.INVALID_INPUT,
          httpStatus: HttpStatusEnum.BAD_REQUEST,
        },
        {
          applicationStatus: ApplicationStatus.SUCCESS,
          httpStatus: HttpStatusEnum.SUCCESS,
        },
        {
          applicationStatus: ApplicationStatus.UNAUTHORIZED,
          httpStatus: HttpStatusEnum.UNAUTHORIZED,
        },
      ],
      description: "Self register user",
      apiDoc: {
        contentType: HttpContentTypeEnum.APPLICATION_JSON,
        requireAuth: false,
        schema: new ResultDescriber({
          type: PropTypeEnum.OBJECT,
          props: ResultDescriber.default(),
        }),
        requestBody: {
          contentType: HttpContentTypeEnum.APPLICATION_JSON,
          description: "User data",
          schema: new TypeDescriber<IUserDto>({
            name: UserDto.name,
            type: PropTypeEnum.OBJECT,
            props: TypeDescriber.describeProps<IUserDto>({
              firstName: PropTypeEnum.STRING,
              lastName: PropTypeEnum.STRING,
              gender: PropTypeEnum.STRING,
              email: PropTypeEnum.STRING,
              passwordB64: PropTypeEnum.STRING,
            }),
          }),
        },
      },
    });
  }
}

export default new UsersController(container);
