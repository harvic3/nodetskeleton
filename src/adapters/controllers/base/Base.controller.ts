import { ILogProvider } from "../../../application/shared/log/providerContracts/ILogProvider";
import { IUseCaseTraceRepository } from "../../repositories/trace/IUseCaseTrace.repository";
import { UseCaseTraceRepository } from "../../repositories/trace/UseCaseTrace.repository";
import { BaseUseCase, IResult } from "../../../application/shared/useCase/BaseUseCase";
import { LocaleTypeEnum } from "../../../application/shared/locals/LocaleType.enum";
import { UseCaseTrace } from "../../../application/shared/log/UseCaseTrace";
import { HttpStatusResolver } from "./httpResponse/HttpStatusResolver";
import { ErrorLog } from "../../../application/shared/log/ErrorLog";
import { ServiceContext } from "../../shared/ServiceContext";
import { HttpHeaderEnum } from "./context/HttpHeader.enum";
import { INextFunction } from "./context/INextFunction";
import { LogProvider } from "../../providers/container";
import { IServiceContainer } from "../../shared/kernel";
import { IRouterType } from "./context/IRouterType";
import { IResponse } from "./context/IResponse";
import { IRequest } from "./context/IRequest";

type EntryPointHandler = (req: IRequest, res: IResponse, next: INextFunction) => Promise<void>;

export { EntryPointHandler, IRequest, IResponse, INextFunction, IRouterType, ServiceContext };

export default abstract class BaseController {
  router?: IRouterType;
  serviceContext: ServiceContext;
  #logProvider: ILogProvider;
  #useCaseTraceRepository: IUseCaseTraceRepository;

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

  private async getResult(res: IResponse, result: IResult): Promise<void> {
    this.setTransactionId(res);
    res.status(HttpStatusResolver.getCode(result.statusCode.toString())).json(result);
  }

  private async getResultDto(res: IResponse, result: IResult): Promise<void> {
    this.setTransactionId(res);
    res.status(HttpStatusResolver.getCode(result.statusCode.toString())).json(result.toResultDto());
  }

  private async getResultData(res: IResponse, result: IResult): Promise<void> {
    this.setTransactionId(res);
    res
      .status(HttpStatusResolver.getCode(result.statusCode.toString()))
      .json(result.message ? result.toResultDto() : result.toResultDto().data);
  }

  private setTransactionId(res: IResponse): void {
    res.setHeader(HttpHeaderEnum.TRANSACTION_ID, res.trace.transactionId);
  }

  private async manageUseCaseTrace(trace: UseCaseTrace): Promise<void> {
    if (trace?.context) {
      trace.finish(new Date());
      return Promise.resolve(this.#useCaseTraceRepository.register(trace)).catch((error) => {
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

  async handleResult<T>(
    res: IResponse,
    next: INextFunction,
    useCase: BaseUseCase<T>,
    locale: LocaleTypeEnum,
    args?: T,
  ): Promise<void> {
    try {
      return await this.getResult(res, await useCase.execute(locale, res.trace, args));
    } catch (error) {
      return next(error);
    } finally {
      this.manageUseCaseTrace(res.trace);
    }
  }

  async handleResultDto<T>(
    res: IResponse,
    next: INextFunction,
    useCase: BaseUseCase<T>,
    locale: LocaleTypeEnum,
    args?: T,
  ): Promise<void> {
    try {
      return await this.getResultDto(res, await useCase.execute(locale, res.trace, args));
    } catch (error) {
      return next(error);
    } finally {
      this.manageUseCaseTrace(res.trace);
    }
  }

  async handleResultData<T>(
    res: IResponse,
    next: INextFunction,
    useCase: BaseUseCase<T>,
    locale: LocaleTypeEnum,
    args?: T,
  ): Promise<void> {
    try {
      return await this.getResultData(res, await useCase.execute(locale, res.trace, args));
    } catch (error) {
      return next(error);
    } finally {
      this.manageUseCaseTrace(res.trace);
    }
  }

  abstract initializeRoutes(router: IRouterType): void;
}
