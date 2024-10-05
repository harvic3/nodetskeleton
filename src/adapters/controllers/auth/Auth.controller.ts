import { TokenDto, TokenDtoType } from "../../../application/modules/auth/dtos/TokenDto";
import { ICredentials } from "../../../application/modules/auth/dtos/Credentials.dto";
import { ResultDescriber, ResultTDescriber } from "../base/apiDoc/ResultDescriber";
import container, { LoginUseCase, LogoutUseCase } from "./container";
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
  HttpHeaderEnum,
  ApplicationStatus,
  HttpStatusEnum,
} from "../base/Base.controller";
import {
  SecuritySchemesDescriber,
  PropFormatEnum,
  TypeDescriber,
  PropTypeEnum,
} from "../base/apiDoc/types";

export class AuthController extends BaseController {
  constructor(serviceContainer: IServiceContainer) {
    super(AuthController.name, serviceContainer, ServiceContext.AUTH);
  }

  login: RequestHandler = async (
    req: IRequest,
    res: IResponse,
    next: INextFunction,
  ): Promise<void> => {
    const email = req.body?.email as string;
    const passwordB64 = req.body?.passwordB64 as string;

    return this.handleResult(
      res,
      next,
      this.servicesContainer
        .get<LoginUseCase>(this.CONTEXT, LoginUseCase.name)
        .execute(req.locale, res.trace, {
          email,
          passwordB64,
        }),
      { [HttpHeaderEnum.CONTENT_TYPE]: HttpContentTypeEnum.APPLICATION_JSON },
    );
  };

  logout: RequestHandler = async (
    req: IRequest,
    res: IResponse,
    next: INextFunction,
  ): Promise<void> => {
    const session = req.session;
    return this.handleResult(
      res,
      next,
      this.servicesContainer
        .get<LogoutUseCase>(this.CONTEXT, LogoutUseCase.name)
        .execute(req.locale, res.trace, { session }),
      { [HttpHeaderEnum.CONTENT_TYPE]: HttpContentTypeEnum.APPLICATION_JSON },
    );
  };

  initializeRoutes(router: IRouter): void {
    this.setRouter(router())
      .addRoute({
        method: HttpMethodEnum.DELETE,
        path: "/v1/auth/logout",
        handlers: [this.logout],
        produces: [
          {
            applicationStatus: ApplicationStatus.SUCCESS,
            httpStatus: HttpStatusEnum.SUCCESS,
            model: {
              contentType: HttpContentTypeEnum.APPLICATION_JSON,
              scheme: new ResultTDescriber<{ closed: boolean }>({
                name: "ClosedSession",
                type: PropTypeEnum.OBJECT,
                props: {
                  data: new TypeDescriber<{ closed: boolean }>({
                    name: "Object",
                    type: PropTypeEnum.OBJECT,
                    props: {
                      closed: {
                        type: PropTypeEnum.BOOLEAN,
                      },
                    },
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
        description: "Logout user",
        apiDoc: {
          requireAuth: true,
          securitySchemes: new SecuritySchemesDescriber(
            SecuritySchemesDescriber.HTTP,
            SecuritySchemesDescriber.defaultHttpBearer(),
          ),
        },
      })
      .addRoute({
        method: HttpMethodEnum.POST,
        path: "/v1/auth/login",
        handlers: [this.login],
        produces: [
          {
            applicationStatus: ApplicationStatus.SUCCESS,
            httpStatus: HttpStatusEnum.SUCCESS,
            model: {
              contentType: HttpContentTypeEnum.APPLICATION_JSON,
              scheme: new ResultTDescriber<TokenDtoType>({
                name: TokenDto.name,
                type: PropTypeEnum.OBJECT,
                props: {
                  data: new TypeDescriber<TokenDtoType>({
                    name: TokenDto.name,
                    type: PropTypeEnum.OBJECT,
                    props: TypeDescriber.describeProps<TokenDtoType>({
                      token: PropTypeEnum.STRING,
                      expiresIn: PropTypeEnum.NUMBER,
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
        description: "Login user",
        apiDoc: {
          requireAuth: false,
          requestBody: {
            description: "Credentials for login",
            required: true,
            contentType: HttpContentTypeEnum.APPLICATION_JSON,
            scheme: new TypeDescriber<ICredentials>({
              name: "Credentials",
              type: PropTypeEnum.OBJECT,
              props: TypeDescriber.describeProps<ICredentials>({
                email: PropTypeEnum.STRING,
                passwordB64: {
                  type: PropTypeEnum.STRING,
                  format: PropFormatEnum.BASE64,
                },
              }),
            }),
          },
        },
      });
  }
}

export default new AuthController(container);
