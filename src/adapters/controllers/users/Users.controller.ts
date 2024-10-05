import { IUserDto, UserDto } from "../../../application/modules/users/dtos/User.dto";
import { ResultDescriber, ResultTDescriber } from "../base/apiDoc/ResultDescriber";
import { ParameterIn, PropTypeEnum, TypeDescriber } from "../base/apiDoc/types";
import container, { GetUserUseCase, RegisterUserUseCase } from "./container";
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

  get: RequestHandler = async (
    req: IRequest,
    res: IResponse,
    next: INextFunction,
  ): Promise<void> => {
    return this.handleResult(
      res,
      next,
      this.servicesContainer
        .get<GetUserUseCase>(this.CONTEXT, GetUserUseCase.name)
        .execute(req.locale, res.trace, { email: req.params.email }),
    );
  };

  initializeRoutes(router: IRouter): void {
    this.setRouter(router())
      .addRoute({
        method: HttpMethodEnum.POST,
        path: "/v1/users/sign-up",
        handlers: [this.singUp],
        produces: [
          {
            applicationStatus: ApplicationStatus.INVALID_INPUT,
            httpStatus: HttpStatusEnum.BAD_REQUEST,
            model: {
              contentType: HttpContentTypeEnum.APPLICATION_JSON,
              scheme: new ResultDescriber({
                type: PropTypeEnum.OBJECT,
                props: ResultDescriber.defaultError(),
              }),
            },
          },
          {
            applicationStatus: ApplicationStatus.SUCCESS,
            httpStatus: HttpStatusEnum.CREATED,
            model: {
              contentType: HttpContentTypeEnum.APPLICATION_JSON,
              scheme: new TypeDescriber<IUserDto>({
                name: UserDto.name,
                type: PropTypeEnum.OBJECT,
                props: TypeDescriber.describeProps<IUserDto>({
                  maskedUid: PropTypeEnum.STRING,
                  firstName: PropTypeEnum.STRING,
                  lastName: PropTypeEnum.STRING,
                  gender: PropTypeEnum.STRING,
                  email: PropTypeEnum.STRING,
                  passwordB64: PropTypeEnum.STRING,
                }),
              }),
            },
          },
          {
            applicationStatus: ApplicationStatus.UNAUTHORIZED,
            httpStatus: HttpStatusEnum.UNAUTHORIZED,
            model: {
              contentType: HttpContentTypeEnum.APPLICATION_JSON,
              scheme: new ResultDescriber({
                type: PropTypeEnum.OBJECT,
                props: ResultDescriber.defaultError(),
              }),
            },
          },
        ],
        description: "Self register user",
        apiDoc: {
          requireAuth: false,
          requestBody: {
            description: "User data",
            contentType: HttpContentTypeEnum.APPLICATION_JSON,
            required: true,
            scheme: new TypeDescriber<IUserDto>({
              name: UserDto.name,
              type: PropTypeEnum.OBJECT,
              props: TypeDescriber.describeProps<IUserDto>({
                maskedUid: PropTypeEnum.STRING,
                firstName: PropTypeEnum.STRING,
                lastName: PropTypeEnum.STRING,
                gender: PropTypeEnum.STRING,
                email: PropTypeEnum.STRING,
                passwordB64: PropTypeEnum.STRING,
              }),
            }),
          },
        },
      })
      .addRoute({
        method: HttpMethodEnum.GET,
        path: "/v1/users/:email",
        handlers: [this.get],
        produces: [
          {
            applicationStatus: ApplicationStatus.INVALID_INPUT,
            httpStatus: HttpStatusEnum.BAD_REQUEST,
            model: {
              contentType: HttpContentTypeEnum.APPLICATION_JSON,
              scheme: new ResultDescriber({
                type: PropTypeEnum.OBJECT,
                props: ResultDescriber.defaultError(),
              }),
            },
          },
          {
            applicationStatus: ApplicationStatus.SUCCESS,
            httpStatus: HttpStatusEnum.SUCCESS,
            model: {
              contentType: HttpContentTypeEnum.APPLICATION_JSON,
              scheme: new ResultTDescriber<IUserDto>({
                name: UserDto.name,
                type: PropTypeEnum.OBJECT,
                props: {
                  data: new TypeDescriber<Omit<IUserDto, "passwordB64">>({
                    name: UserDto.name,
                    type: PropTypeEnum.OBJECT,
                    props: TypeDescriber.describeProps<Omit<IUserDto, "passwordB64">>({
                      maskedUid: PropTypeEnum.STRING,
                      firstName: PropTypeEnum.STRING,
                      lastName: PropTypeEnum.STRING,
                      email: PropTypeEnum.STRING,
                      gender: PropTypeEnum.STRING,
                    }),
                  }),
                  ...ResultDescriber.default(),
                },
              }),
            },
          },
          {
            applicationStatus: ApplicationStatus.UNAUTHORIZED,
            httpStatus: HttpStatusEnum.UNAUTHORIZED,
            model: {
              contentType: HttpContentTypeEnum.APPLICATION_JSON,
              scheme: new ResultDescriber({
                type: PropTypeEnum.OBJECT,
                props: ResultDescriber.defaultError(),
              }),
            },
          },
        ],
        description: "Get user",
        apiDoc: {
          requireAuth: true,
          parameters: [
            TypeDescriber.describeUrlParam({
              name: "email",
              in: ParameterIn.PATH,
              description: "User email",
            }),
          ],
        },
      });
  }
}

export default new UsersController(container);
