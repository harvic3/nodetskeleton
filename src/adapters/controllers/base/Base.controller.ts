import { ILogProvider } from "../../../application/shared/log/providerContracts/ILogProvider";
import { IUseCaseTraceRepository } from "../../repositories/trace/IUseCaseTrace.repository";
import { UseCaseTraceRepository } from "../../repositories/trace/UseCaseTrace.repository";
import { UseCaseTrace } from "../../../application/shared/log/UseCaseTrace";
import { IResult } from "../../../application/shared/useCase/BaseUseCase";
import { HttpStatusResolver } from "./httpResponse/HttpStatusResolver";
import { ErrorLog } from "../../../application/shared/log/ErrorLog";
import { ServiceContext } from "../../shared/ServiceContext";
import { HttpHeaderEnum } from "./context/HttpHeader.enum";
import { LogProvider } from "../../providers/container";
import { INextFunction } from "./context/INextFunction";
import { IServiceContainer } from "../../shared/kernel";
import { IContext } from "./context/IContext";
import { IRouter } from "./context/IRouter";

type EntryPointHandler = (req: IContext, next: INextFunction) => Promise<void>;

export { EntryPointHandler, IContext, INextFunction, IRouter, ServiceContext };

export default abstract class BaseController {
  router?: IRouter;
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

  private async getResult(ctx: IContext, result: IResult): Promise<void> {
    this.setTransactionId(ctx);
    ctx.status = HttpStatusResolver.getCode(result.statusCode.toString());
    ctx.body = result;
  }

  private async getResultDto(ctx: IContext, result: IResult): Promise<void> {
    this.setTransactionId(ctx);
    ctx.status = HttpStatusResolver.getCode(result.statusCode.toString());
    ctx.body = result?.message || result.toResultDto();
  }

  private async getResultData(ctx: IContext, result: IResult): Promise<void> {
    this.setTransactionId(ctx);
    ctx.status = HttpStatusResolver.getCode(result.statusCode.toString());
    if (result.success) {
      ctx.body = result.message ? result.toResultDto() : result.toResultDto().data;
    } else {
      ctx.body = result.toResultDto();
    }
  }

  private setTransactionId(ctx: IContext): void {
    ctx.response.set(HttpHeaderEnum.TRANSACTION_ID, ctx.trace.transactionId);
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
    ctx: IContext,
    next: INextFunction,
    useCasePromise: Promise<IResult>,
  ): Promise<void> {
    try {
      return await this.getResult(ctx, await useCasePromise);
    } catch (error) {
      return next(error);
    } finally {
      return this.manageUseCaseTrace(ctx.trace);
    }
  }

  async handleResultDto<T>(
    ctx: IContext,
    next: INextFunction,
    useCasePromise: Promise<IResult>,
  ): Promise<void> {
    try {
      return await this.getResultDto(ctx, await useCasePromise);
    } catch (error) {
      return next(error);
    } finally {
      return this.manageUseCaseTrace(ctx.trace);
    }
  }

  async handleResultData<T>(
    ctx: IContext,
    next: INextFunction,
    useCasePromise: Promise<IResult>,
  ): Promise<void> {
    try {
      return await this.getResultData(ctx, await useCasePromise);
    } catch (error) {
      return next(error);
    } finally {
      return this.manageUseCaseTrace(ctx.trace);
    }
  }

  abstract initializeRoutes(router: IRouter): void;
}
