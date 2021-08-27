export { Request, Response, NextFunction } from "../../../infrastructure/app/core/Modules";
import { Router, Response, RouterType } from "../../../infrastructure/app/core/Modules";
import { HttpStatusResolver } from "./httpResponse/HttpStatusResolver";
import { IResult } from "result-tsk";

export default abstract class BaseController {
  router: RouterType;

  constructor() {
    this.router = Router();
  }

  handleResult(res: Response, result: IResult): void {
    res.status(HttpStatusResolver.getCode(result.statusCode.toString())).json(result);
  }

  handleResultDto(res: Response, result: IResult): void {
    res.status(HttpStatusResolver.getCode(result.statusCode.toString())).json(result.toResultDto());
  }

  handleResultData(res: Response, result: IResult): void {
    res
      .status(HttpStatusResolver.getCode(result.statusCode.toString()))
      .json(result.message ? result.toResultDto() : result.toResultDto().data);
  }

  protected abstract initializeRoutes(): void;
}
