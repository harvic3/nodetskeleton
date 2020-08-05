import config from "../../infrastructure/config";
import { Router, Context } from "../../infrastructure/server/CoreModules";
import { IResult } from "../../application/shared/result/Result.interface";

export default class BaseController {
  constructor() {
    this.router = new Router();
    this.router.prefix(config.server.root);
  }
  router: Router;
  HandleResult(ctx: Context, result: IResult): void {
    ctx.status = result.statusCode;
    if (result.success) {
      ctx.body = result.message ? result.ToResultDto() : result.ToResultDto().data;
    } else {
      ctx.body = result.ToResultDto();
    }
  }
}
