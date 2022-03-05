import { BaseUseCase, IResult } from "../../../application/shared/useCase/BaseUseCase";
import { ServiceContext } from "../../../infrastructure/app/server/ServiceContext";
import { HttpStatusResolver } from "./httpResponse/HttpStatusResolver";
import {
  Router,
  Request,
  Response,
  RouterType,
  RequestBase,
  NextFunction,
  RequestHandler,
} from "../../../infrastructure/app/core/Modules";

type EntryPointHandler = (
  req: Request | RequestBase,
  res: Response,
  next: NextFunction,
) => Promise<void>;
export {
  EntryPointHandler,
  Request,
  RequestBase,
  Response,
  NextFunction,
  RequestHandler,
  ServiceContext,
};

export default abstract class BaseController {
  router: RouterType;

  constructor(readonly serviceContext: ServiceContext = ServiceContext.NODE_TS_SKELETON) {
    this.router = Router();
  }

  private getResult(res: Response, result: IResult): void {
    res.status(HttpStatusResolver.getCode(result.statusCode.toString())).json(result);
  }

  private getResultDto(res: Response, result: IResult): void {
    res.status(HttpStatusResolver.getCode(result.statusCode.toString())).json(result.toResultDto());
  }

  private getResultData(res: Response, result: IResult): void {
    res
      .status(HttpStatusResolver.getCode(result.statusCode.toString()))
      .json(result.message ? result.toResultDto() : result.toResultDto().data);
  }

  async handleResult<T>(
    res: Response,
    next: NextFunction,
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
    res: Response,
    next: NextFunction,
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
    res: Response,
    next: NextFunction,
    useCase: BaseUseCase<T>,
    args?: T,
  ): Promise<void> {
    try {
      return this.getResultData(res, await useCase.execute(args));
    } catch (error) {
      return next(error);
    }
  }

  protected abstract initializeRoutes(): void;
}
