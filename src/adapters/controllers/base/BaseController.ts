export { Request, Response, NextFunction } from "../../../infrastructure/server/core/Modules";
import { Router, Response, RouterType } from "../../../infrastructure/server/core/Modules";
import { HttpStatusResolver } from "./httpResponse/HttpStatusResolver";
import { IResult } from "result-tsk";

export default class BaseController {
  router: RouterType;

  constructor() {
    this.router = Router();
  }

  handleResult(res: Response, result: IResult): void {
    if (result.success) {
      res
        .status(HttpStatusResolver.getCode(result.statusCode.toString()))
        .json(result.message ? result.toResultDto() : result.toResultDto().data);
    } else {
      res
        .status(HttpStatusResolver.getCode(result.statusCode.toString()))
        .json(result.toResultDto());
    }
  }
}
