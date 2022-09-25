import { ILogProvider } from "../../../application/shared/log/providerContracts/ILogProvider";
import { IUseCaseTraceRepository } from "../../repositories/trace/IUseCaseTrace.repository";
import { UseCaseTraceRepository } from "../../repositories/trace/UseCaseTrace.repository";
import { BaseUseCase, IResult } from "../../../application/shared/useCase/BaseUseCase";
import { LocaleTypeEnum } from "../../../application/shared/locals/LocaleType.enum";
import { UseCaseTrace } from "../../../application/shared/log/UseCaseTrace";
import { HttpStatusResolver } from "./httpResponse/HttpStatusResolver";
import { ErrorLog } from "../../../application/shared/log/ErrorLog";
import { ServiceContext } from "../../shared/ServiceContext";
import { INextFunction } from "./context/INextFunction";
import { LogProvider } from "../../providers/container";
import { IServiceContainer } from "../../shared/kernel";
import { IRouterType } from "./context/IRouterType";
import { IContext } from "./context/IContext";

type EntryPointHandler = (req: IContext, next: INextFunction) => Promise<void>;

export { EntryPointHandler, IContext, INextFunction, IRouterType, ServiceContext };

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

  private async getResult(ctx: IContext, result: IResult): Promise<void> {
    ctx.status = HttpStatusResolver.getCode(result.statusCode.toString());
    ctx.body = result;
  }

  private async getResultDto(ctx: IContext, result: IResult): Promise<void> {
    ctx.status = HttpStatusResolver.getCode(result.statusCode.toString());
    ctx.body = result?.message || result.toResultDto();
  }

  private async getResultData(ctx: IContext, result: IResult): Promise<void> {
    ctx.status = HttpStatusResolver.getCode(result.statusCode.toString());
    if (result.success) {
      ctx.body = result.message ? result.toResultDto() : result.toResultDto().data;
    } else {
      ctx.body = result.toResultDto();
    }
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
    useCase: BaseUseCase<T>,
    locale: LocaleTypeEnum,
    args?: T,
  ): Promise<void> {
    try {
      return await this.getResult(ctx, await useCase.execute(locale, ctx.trace, args));
    } catch (error) {
      return next(error);
    } finally {
      return this.manageUseCaseTrace(ctx.trace);
    }
  }

  async handleResultDto<T>(
    ctx: IContext,
    next: INextFunction,
    useCase: BaseUseCase<T>,
    locale: LocaleTypeEnum,
    args?: T,
  ): Promise<void> {
    try {
      return await this.getResultDto(ctx, await useCase.execute(locale, ctx.trace, args));
    } catch (error) {
      return next(error);
    } finally {
      return this.manageUseCaseTrace(ctx.trace);
    }
  }

  async handleResultData<T>(
    ctx: IContext,
    next: INextFunction,
    useCase: BaseUseCase<T>,
    locale: LocaleTypeEnum,
    args?: T,
  ): Promise<void> {
    try {
      return await this.getResultData(ctx, await useCase.execute(locale, ctx.trace, args));
    } catch (error) {
      return next(error);
    } finally {
      return this.manageUseCaseTrace(ctx.trace);
    }
  }

  abstract initializeRoutes(router: IRouterType): void;
}
