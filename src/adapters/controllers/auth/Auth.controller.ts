import { ICredentials } from "../../../application/modules/auth/dtos/Credentials.dto";
import { TypeDescriber, ResultDescriber } from "../base/context/apiDoc/TypeDescriber";
import { TokenDto } from "../../../application/modules/auth/dtos/TokenDto";
import { IServiceContainer } from "../../shared/kernel";
import container, { LoginUseCase } from "./container";
import { IResult } from "result-tsk";
import BaseController, {
  IRequest,
  IResponse,
  INextFunction,
  EntryPointHandler,
  IRouter,
  ServiceContext,
  HttpContentTypeEnum,
  HttpMethodEnum,
  HttpHeaderEnum,
  applicationStatus,
  httpStatus,
} from "../base/Base.controller";

export class AuthController extends BaseController {
  constructor(serviceContainer: IServiceContainer) {
    super(AuthController.name, serviceContainer, ServiceContext.SECURITY);
  }

  login: EntryPointHandler = async (
    req: IRequest,
    res: IResponse,
    next: INextFunction,
  ): Promise<void> => {
    const email = req.body?.email as string;
    const passwordB64 = req.body?.password as string;

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

  initializeRoutes(router: IRouter): void {
    this.setRouter(router());
    this.addRoute({
      method: HttpMethodEnum.POST,
      path: "/v1/auth/login",
      handlers: [this.login],
      requireAuth: false,
      contentType: HttpContentTypeEnum.APPLICATION_JSON,
      description: "Login user",
      request: new TypeDescriber<ICredentials>({
        type: "object",
        props: {
          email: {
            propType: "string",
            description: "User email",
            required: true,
          },
          passwordB64: {
            propType: "string",
            description: "User password encoded in base64",
            required: true,
          },
        },
      }),
      response: new ResultDescriber<IResult>({
        type: "object",
        props: {
          data: new TypeDescriber<TokenDto>({
            type: "object",
            props: {
              token: {
                propType: "string",
                description: "Jwt to use as authorization header in requests",
              },
              expiresIn: {
                propType: "number",
                description: "Jwt expiration time in seconds",
              },
            },
          }),
          error: {
            propType: "string",
            description: "Error message if any",
          },
          message: {
            propType: "string",
            description: "Application message if any",
          },
          statusCode: {
            propType: "string",
            description: "Application status code",
          },
          success: {
            propType: "boolean",
            description: "Indicates if the request was successful",
          },
        },
      }),
      produces: [
        {
          applicationStatus: applicationStatus.SUCCESS,
          httpStatus: httpStatus.SUCCESS,
        },
        {
          applicationStatus: applicationStatus.UNAUTHORIZED,
          httpStatus: httpStatus.UNAUTHORIZED,
        },
      ],
    });
  }
}

export default new AuthController(container);
