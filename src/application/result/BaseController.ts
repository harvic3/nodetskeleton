// // For KoaJs
// import config from "../../infraestructure/config";
// import { IResult } from "./Result.interface";
// import { Context } from "../../infraestructure/config";

// export default class BaseController {
//   public router = config.coreModules.Router();
//   HandleResult(ctx: Context, result: IResult): void {
//     ctx.status = result.statusCode;
//     ctx.body = result;
//   }
// }

// For ExpressJs
import config from "../../infraestructure/config";
import { IResult } from "./Result.interface";
import { Response } from "../../infraestructure/config";

export default class BaseController {
  public router = config.coreModules.Router();
  HandleResult(res: Response, result: IResult): void {
    res.status(result.statusCode).json(result);
  }
}
