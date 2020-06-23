// // For KoaJs
// import { IResult } from "./Result.interface";
// import { Context } from "../../infraestructure/config";

// export default class BaseController {
//   HandleResult(ctx: Context, result: IResult): any {
//     ctx.status = result.statusCode;
//     ctx.body = result;
//   }
// }

// For ExpressJs
import { IResult } from "./Result.interface";
import { Response } from "../../infraestructure/config";

export default class BaseController {
  HandleResult(res: Response, result: IResult): void {
    res.status(result.statusCode).json(result);
  }
}
