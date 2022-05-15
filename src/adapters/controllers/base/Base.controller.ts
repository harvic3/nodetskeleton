import { BaseUseCase, IResult } from "../../../application/shared/useCase/BaseUseCase";
import { HttpStatusResolver } from "./httpResponse/HttpStatusResolver";
import { IServiceContainer } from "../../shared/dic/IServiceContainer";
import { ServiceContext } from "../../shared/ServiceContext";
import { INextFunction } from "./context/INextFunction";
import { IRouterType } from "./context/IRouterType";
import { IContext } from "./context/IContext";

type EntryPointHandler = (req: IContext, next: INextFunction) => Promise<void>;

export { EntryPointHandler, IContext, INextFunction, IRouterType, ServiceContext };

export default abstract class BaseController {
  router?: IRouterType;
  serviceContext: ServiceContext;

  constructor(
    readonly CONTEXT: string,
    readonly servicesContainer: IServiceContainer,
    serviceContext: ServiceContext = ServiceContext.NODE_TS_SKELETON,
  ) {
    this.serviceContext = serviceContext;
  }

  private getResult(ctx: IContext, result: IResult): void {
    ctx.status = HttpStatusResolver.getCode(result.statusCode.toString());
    ctx.body = result;
  }

  private getResultDto(ctx: IContext, result: IResult): void {
    ctx.status = HttpStatusResolver.getCode(result.statusCode.toString());
    ctx.body = result?.message || result.toResultDto();
  }

  private getResultData(ctx: IContext, result: IResult): void {
    ctx.status = HttpStatusResolver.getCode(result.statusCode.toString());
    if (result.success) {
      ctx.body = result.message ? result.toResultDto() : result.toResultDto().data;
    } else {
      ctx.body = result.toResultDto();
    }
  }

  async handleResult<T>(
    ctx: IContext,
    next: INextFunction,
    useCase: BaseUseCase<T>,
    args?: T,
  ): Promise<void> {
    try {
      return this.getResult(ctx, await useCase.execute(args));
    } catch (error) {
      ctx.app.emit("error", error, ctx);
      return next();
    }
  }

  async handleResultDto<T>(
    ctx: IContext,
    next: INextFunction,
    useCase: BaseUseCase<T>,
    args?: T,
  ): Promise<void> {
    try {
      return this.getResultDto(ctx, await useCase.execute(args));
    } catch (error) {
      ctx.app.emit("error", error, ctx);
      return next();
    }
  }

  async handleResultData<T>(
    ctx: IContext,
    next: INextFunction,
    useCase: BaseUseCase<T>,
    args?: T,
  ): Promise<void> {
    try {
      return this.getResultData(ctx, await useCase.execute(args));
    } catch (error) {
      ctx.app.emit("error", error, ctx);
      return next();
    }
  }

  abstract initializeRoutes(router: IRouterType): void;
}
