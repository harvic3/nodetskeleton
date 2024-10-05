import container, { PongUseCase, NotFoundUseCase } from "./container/index";
import { PropTypeEnum, TypeDescriber } from "../base/apiDoc/types";
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
          model: {
            contentType: HttpContentTypeEnum.TEXT_PLAIN,
            scheme: new TypeDescriber<string>({
              name: PropTypeEnum.STRING,
              type: PropTypeEnum.PRIMITIVE,
              props: TypeDescriber.describePrimitive(PropTypeEnum.STRING),
            }),
          },
        },
      ],
      description: "API status endpoint",
      apiDoc: {
        requireAuth: false,
      },
    });
  }
}

export default new StatusController(container);
