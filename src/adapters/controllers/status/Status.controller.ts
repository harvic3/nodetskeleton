import { PropTypeEnum, TypeDescriber } from "../base/context/apiDoc/TypeDescriber";
import container, { PongUseCase, NotFoundUseCase } from "./container/index";
import { IServiceContainer } from "../../shared/kernel";
import BaseController, {
  HttpContentTypeEnum,
  ApplicationStatus,
  RequestHandler,
  HttpMethodEnum,
  HttpHeaderEnum,
  HttpStatusEnum,
  INextFunction,
  IResponse,
  IRequest,
  IRouter,
} from "../base/Base.controller";

export class StatusController extends BaseController {
  constructor(serviceContainer: IServiceContainer) {
    super(StatusController.name, serviceContainer);
  }

  pong: RequestHandler = async (
    req: IRequest,
    res: IResponse,
    next: INextFunction,
  ): Promise<void> => {
    return this.handleResultData(
      res,
      next,
      this.servicesContainer.get<PongUseCase>(this.CONTEXT, PongUseCase.name).execute(req.locale),
      { [HttpHeaderEnum.CONTENT_TYPE]: HttpContentTypeEnum.TEXT_PLAIN },
    );
  };

  resourceNotFound: RequestHandler = async (
    req: IRequest,
    res: IResponse,
    next: INextFunction,
  ): Promise<void> => {
    return this.handleResult(
      res,
      next,
      this.servicesContainer
        .get<NotFoundUseCase>(this.CONTEXT, NotFoundUseCase.name)
        .execute(req.locale),
      { [HttpHeaderEnum.CONTENT_TYPE]: HttpContentTypeEnum.TEXT_PLAIN },
    );
  };

  initializeRoutes(router: IRouter): void {
    this.setRouter(router());
    this.addRoute({
      method: HttpMethodEnum.GET,
      path: "/status",
      handlers: [this.pong],
      produces: [
        {
          applicationStatus: ApplicationStatus.SUCCESS,
          httpStatus: HttpStatusEnum.SUCCESS,
        },
      ],
      description: "API status endpoint",
      apiDoc: {
        contentType: HttpContentTypeEnum.TEXT_PLAIN,
        requireAuth: false,
        schema: new TypeDescriber<string>({
          name: PropTypeEnum.STRING,
          type: PropTypeEnum.PRIMITIVE,
          props: {
            primitive: PropTypeEnum.STRING,
          },
        }),
      },
    });
  }
}

export default new StatusController(container);
