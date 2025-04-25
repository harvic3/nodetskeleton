import { ILogProvider } from "../../../application/shared/log/providerContracts/ILogProvider";
import { IUseCaseTraceRepository } from "../../repositories/trace/IUseCaseTrace.repository";
import { UseCaseTraceRepository } from "../../repositories/trace/UseCaseTrace.repository";
import { ApplicationStatus } from "../../../application/shared/status/applicationStatus";
import { UseCaseTrace } from "../../../application/shared/log/UseCaseTrace";
import AppSettings from "../../../application/shared/settings/AppSettings";
import { IResult } from "../../../application/shared/useCase/BaseUseCase";
import { ApiProduce, IApiDocGenerator, RouteType } from "./apiDoc/types";
import { HttpStatusResolver } from "./httpResponse/HttpStatusResolver";
import { HttpContentTypeEnum } from "./context/HttpContentType.enum";
import { ErrorLog } from "../../../application/shared/log/ErrorLog";
import { HttpStatusEnum } from "./httpResponse/HttpStatusEnum";
import { ServiceContext } from "../../shared/ServiceContext";
import statusMapping from "./httpResponse/AppStatusMapping";
import { HttpMethodEnum } from "./context/HttpMethod.enum";
import { HttpHeaderEnum } from "./context/HttpHeader.enum";
import { LogProvider } from "../../providers/container";
import { INextFunction } from "./context/INextFunction";
import { IServiceContainer } from "../../shared/kernel";
import { IResponse } from "./context/IResponse";
import { IRequest } from "./context/IRequest";
import { IRouter } from "./context/IRouter";

type RequestHandler = (req: IRequest, res: IResponse, next: INextFunction) => Promise<void>;
type HeaderType = { [key in HttpHeaderEnum]?: HttpContentTypeEnum | string };

export {
  RequestHandler,
  IRequest,
  IResponse,
  INextFunction,
  IRouter,
  ServiceContext,
  HttpMethodEnum,
  HttpContentTypeEnum,
  HttpHeaderEnum,
  HttpStatusEnum,
  ApplicationStatus,
};

export default abstract class BaseController {
  router?: IRouter;
  apiDocGenerator?: IApiDocGenerator;
  serviceContext: ServiceContext;
  readonly #logProvider: ILogProvider;
  readonly #useCaseTraceRepository: IUseCaseTraceRepository;

  constructor(
    readonly CONTEXT: string,
    readonly servicesContainer: IServiceContainer,
    serviceContext: ServiceContext = ServiceContext.NODE_TS_SKELETON,
  ) {
    this.serviceContext = serviceContext;
    this.#useCaseTraceRepository = this.servicesContainer.get<IUseCaseTraceRepository>(
      this.CONTEXT,
      UseCaseTraceRepository.name,
    );
    this.#logProvider = this.servicesContainer.get<LogProvider>(this.CONTEXT, LogProvider.name);
  }

  setApiDocGenerator(apiDocGenerator: IApiDocGenerator): void {
    this.apiDocGenerator = apiDocGenerator;
  }

  setRouter(router: IRouter): BaseController {
    this.router = router;

    return this;
  }

  private setTransactionId(res: IResponse): void {
    res.setHeader(HttpHeaderEnum.TRANSACTION_ID, res.trace.transactionId);
  }

  private setHeaders(res: IResponse, headersToSet?: HeaderType): void {
    if (headersToSet) {
      Object.entries(headersToSet).forEach(([key, value]) => res.setHeader(key, value));
    }
  }

  private async getResult(
    res: IResponse,
    result: IResult,
    headersToSet?: HeaderType,
  ): Promise<void> {
    this.setTransactionId(res);
    this.setHeaders(res, headersToSet);
    res
      .status(HttpStatusResolver.getCode(result.statusCode.toString() as ApplicationStatus))
      .json(result);
  }

  private async getResultDto(
    res: IResponse,
    result: IResult,
    headersToSet?: HeaderType,
  ): Promise<void> {
    this.setTransactionId(res);
    this.setHeaders(res, headersToSet);
    res
      .status(HttpStatusResolver.getCode(result.statusCode.toString() as ApplicationStatus))
      .json(result.toResultDto());
  }

  private async getResultData(
    res: IResponse,
    result: IResult,
    headersToSet?: HeaderType,
  ): Promise<void> {
    this.setTransactionId(res);
    this.setHeaders(res, headersToSet);
    res
      .status(HttpStatusResolver.getCode(result.statusCode.toString() as ApplicationStatus))
      .json(result.message ? result.toResultDto() : result.toResultDto().data);
  }

  private async manageUseCaseTrace(trace: UseCaseTrace): Promise<void> {
    if (trace?.context) {
      trace.finish(new Date());
      return this.#useCaseTraceRepository.register(trace).catch((error) => {
        this.#logProvider.logError(
          new ErrorLog({
            context: this.CONTEXT,
            name: "ManageUseCaseTraceError",
            message: error.message,
            stack: error.stack,
          }),
        );
      });
    }
  }

  private setProducesCode(applicationStatus: string, httpStatus: HttpStatusEnum): void {
    if (!statusMapping[applicationStatus]) {
      statusMapping[applicationStatus] = httpStatus;
    }
  }

  addRoute(route: RouteType): BaseController {
    const { method, path, handlers, produces, description, apiDoc } = route;
    produces.forEach(({ applicationStatus, httpStatus }) =>
      this.setProducesCode(applicationStatus, httpStatus),
    );
    if (!this.router) {
      throw new Error("Router not initialized, you should call setRouter method before addRoute.");
    }

    this.router[method](path, ...handlers);

    if (this.apiDocGenerator && AppSettings.isDev()) {
      this.apiDocGenerator.createRouteDoc({
        method,
        path,
        produces: produces as ApiProduce[],
        description,
        apiDoc: apiDoc,
      });
    }

    return this;
  }

  async handleResult(
    res: IResponse,
    next: INextFunction,
    useCasePromise: Promise<IResult>,
    headersToSet?: HeaderType,
  ): Promise<void> {
    try {
      return await this.getResult(res, await useCasePromise, headersToSet);
    } catch (error) {
      return next(error);
    } finally {
      this.manageUseCaseTrace(res.trace.setHttpStatus(res.statusCode));
    }
  }

  async handleResultDto(
    res: IResponse,
    next: INextFunction,
    useCasePromise: Promise<IResult>,
    headersToSet?: HeaderType,
  ): Promise<void> {
    try {
      return await this.getResultDto(res, await useCasePromise, headersToSet);
    } catch (error) {
      return next(error);
    } finally {
      this.manageUseCaseTrace(res.trace.setHttpStatus(res.statusCode));
    }
  }

  async handleResultData(
    res: IResponse,
    next: INextFunction,
    useCasePromise: Promise<IResult>,
    headersToSet?: HeaderType,
  ): Promise<void> {
    try {
      return await this.getResultData(res, await useCasePromise, headersToSet);
    } catch (error) {
      return next(error);
    } finally {
      this.manageUseCaseTrace(res.trace.setHttpStatus(res.statusCode));
    }
  }

  abstract initializeRoutes(router: IRouter): void;
}
