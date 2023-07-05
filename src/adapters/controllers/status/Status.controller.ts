import { PropTypeEnum, TypeDescriber } from "../base/context/apiDoc/TypeDescriber";
import container, { PongUseCase, NotFoundUseCase } from "./container/index";
import { IServiceContainer } from "../../shared/kernel";
import BaseController, {
  IRequest,
  IResponse,
  INextFunction,
  EntryPointHandler,
  IRouter,
  HttpContentTypeEnum,
  HttpMethodEnum,
  HttpHeaderEnum,
  applicationStatus,
  HttpStatusEnum,
} from "../base/Base.controller";

export class StatusController extends BaseController {
  constructor(serviceContainer: IServiceContainer) {
    super(StatusController.name, serviceContainer);
  }

  pong: EntryPointHandler = async (
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

  resourceNotFound: EntryPointHandler = async (
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
      path: "/ping",
      handlers: [this.pong],
      produces: [
        {
          applicationStatus: applicationStatus.SUCCESS,
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
