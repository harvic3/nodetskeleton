import { ICredentials } from "../../../application/modules/auth/dtos/Credentials.dto";
import { OwnerDto, TokenDto } from "../../../application/modules/auth/dtos/TokenDto";
import container, { LoginUseCase, LogoutUseCase } from "./container";
import { IServiceContainer } from "../../shared/kernel";
import {
  TypeDescriber,
  ResultTDescriber,
  PropTypeEnum,
  SecuritySchemesDescriber,
  ResultDescriber,
} from "../base/context/apiDoc/TypeDescriber";
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
    this.setRouter(router());
    this.addRoute({
      method: HttpMethodEnum.DELETE,
      path: "/v1/auth/logout",
      handlers: [this.logout],
      produces: [
        {
          applicationStatus: ApplicationStatus.SUCCESS,
          httpStatus: HttpStatusEnum.SUCCESS,
        },
        {
          applicationStatus: ApplicationStatus.UNAUTHORIZED,
          httpStatus: HttpStatusEnum.UNAUTHORIZED,
        },
      ],
      description: "Logout user",
      apiDoc: {
        contentType: HttpContentTypeEnum.APPLICATION_JSON,
        requireAuth: true,
        schema: new ResultTDescriber<{ closed: boolean }>({
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
        securitySchemes: new SecuritySchemesDescriber("bearerAuth", {
          type: "http",
          scheme: "bearer",
          bearerFormat: "bearer",
        }),
      },
    });
    this.addRoute({
      method: HttpMethodEnum.POST,
      path: "/v1/auth/login",
      handlers: [this.login],
      produces: [
        {
          applicationStatus: ApplicationStatus.SUCCESS,
          httpStatus: HttpStatusEnum.SUCCESS,
        },
        {
          applicationStatus: ApplicationStatus.UNAUTHORIZED,
          httpStatus: HttpStatusEnum.UNAUTHORIZED,
        },
      ],
      description: "Login user",
      apiDoc: {
        contentType: HttpContentTypeEnum.APPLICATION_JSON,
        requireAuth: false,
        schema: new ResultTDescriber<TokenDto>({
          name: TokenDto.name,
          type: PropTypeEnum.OBJECT,
          props: {
            data: new TypeDescriber<TokenDto>({
              name: TokenDto.name,
              type: PropTypeEnum.OBJECT,
              props: TypeDescriber.describeProps<TokenDto>({
                token: PropTypeEnum.STRING,
                expiresIn: PropTypeEnum.NUMBER,
                // This added section is only a demo to show how to use nested objects in the response
                owner: TypeDescriber.describeReference<OwnerDto>(OwnerDto.name, {
                  email: PropTypeEnum.STRING,
                  sessionId: PropTypeEnum.STRING,
                }),
              }),
            }),
            ...ResultDescriber.default(),
          },
        }),
        requestBody: {
          description: "Credentials for login",
          contentType: HttpContentTypeEnum.APPLICATION_JSON,
          schema: new TypeDescriber<ICredentials>({
            name: "Credentials",
            type: PropTypeEnum.OBJECT,
            props: {
              email: {
                type: PropTypeEnum.STRING,
                required: true,
              },
              passwordB64: {
                type: PropTypeEnum.STRING,
                required: true,
              },
            },
          }),
        },
      },
    });
  }
}

export default new AuthController(container);
