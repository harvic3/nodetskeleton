import { BaseUseCase, IResult } from "../../../application/shared/useCase/BaseUseCase";
import { HttpStatusResolver } from "./httpResponse/HttpStatusResolver";
import { IServiceContainer } from "../../shared/dic/IServiceContainer";
import { ServiceContext } from "../../shared/ServiceContext";
import { INextFunction } from "./context/INextFunction";
import { IRouterType } from "./context/IRouterType";
import { IResponse } from "./context/IResponse";
import { IRequest } from "./context/IRequest";

type EntryPointHandler = (req: IRequest, res: IResponse, next: INextFunction) => Promise<void>;

export { EntryPointHandler, IRequest, IResponse, INextFunction, IRouterType, ServiceContext };

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

  private getResult(res: IResponse, result: IResult): void {
    res.status(HttpStatusResolver.getCode(result.statusCode.toString())).json(result);
  }

  private getResultDto(res: IResponse, result: IResult): void {
    res.status(HttpStatusResolver.getCode(result.statusCode.toString())).json(result.toResultDto());
  }

  private getResultData(res: IResponse, result: IResult): void {
    res
      .status(HttpStatusResolver.getCode(result.statusCode.toString()))
      .json(result.message ? result.toResultDto() : result.toResultDto().data);
  }

  async handleResult<T>(
    res: IResponse,
    next: INextFunction,
    useCase: BaseUseCase<T>,
    args?: T,
  ): Promise<void> {
    try {
      return this.getResult(res, await useCase.execute(args));
    } catch (error) {
      return next(error);
    }
  }

  async handleResultDto<T>(
    res: IResponse,
    next: INextFunction,
    useCase: BaseUseCase<T>,
    args?: T,
  ): Promise<void> {
    try {
      return this.getResultDto(res, await useCase.execute(args));
    } catch (error) {
      return next(error);
    }
  }

  async handleResultData<T>(
    res: IResponse,
    next: INextFunction,
    useCase: BaseUseCase<T>,
    args?: T,
  ): Promise<void> {
    try {
      return this.getResultData(res, await useCase.execute(args));
    } catch (error) {
      return next(error);
    }
  }

  abstract initializeRoutes(router: IRouterType): void;
}
