// For KoaJs
// import config from "../../config";
// import { Context } from "../../server/CoreModules";
// import { Result } from "result-tsk";
// import { ApplicationError } from "../../../application/shared/errors/ApplicationError";
// import resources from "../../../application/shared/locals/index";
// import { HttpStatusResolver } from "../../../adapters/controllers/base/httpResponse/HttpStatusResolver";

// export default function () {
//   return async function (err: ApplicationError, context: Context): Promise<void> {
//     const result = new Result();
//     if (err?.name === "ApplicationError") {
//       console.log("Controlled application error", err.message);
//       result.setError(err.message, err.errorCode);
//     } else {
//       console.log("No controlled application error", err);
//       result.setError(
//         resources.get(config.params.defaultApplicationError.message),
//         config.params.defaultApplicationError.code,
//       );
//     }
//     context.status = HttpStatusResolver.getCode(result.statusCode.toString());
//     context.body = result.ToResultDto();
//   };
// }

// For ExpressJs
import { HttpStatusResolver } from "../../../adapters/controllers/base/httpResponse/HttpStatusResolver";
import { ApplicationError } from "../../../application/shared/errors/ApplicationError";
import { Request, Response, NextFunction } from "../../server/CoreModules";
import resources from "../../../application/shared/locals";
import { Result } from "result-tsk";
import config from "../../config";

export class HandlerErrorMiddleware {
  handler(err: ApplicationError, req: Request, res: Response, next: NextFunction): void {
    const result = new Result();
    if (err?.name === "ApplicationError") {
      console.log("Controlled application error", err.message);
      result.setError(err.message, err.errorCode);
    } else {
      console.log("No controlled application error", err);
      result.setError(
        resources.get(config.params.defaultApplicationError.message),
        config.params.defaultApplicationError.code,
      );
    }
    if (res.headersSent) {
      return next(result);
    }
    res.status(HttpStatusResolver.getCode(result.statusCode.toString())).send(result);
  }
}

export default new HandlerErrorMiddleware();
