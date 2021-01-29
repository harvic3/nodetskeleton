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
//       result.SetError(err.message, err.errorCode);
//     } else {
//       console.log("No controlled application error", err);
//       result.SetError(
//         resources.Get(config.params.defaultError.message),
//         config.params.defaultError.code,
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
import { Result } from "result-tsk";
import config from "../../config";

export default function () {
  return async function (
    err: ApplicationError,
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const result = new Result();
    if (err?.name === "ApplicationError") {
      console.log("Controlled application error", err.message);
      result.SetError(err.message, err.errorCode);
    } else {
      console.log("No controlled application error", err);
      result.SetError(
        config.params.defaultApplicationError.message,
        config.params.defaultApplicationError.code,
      );
    }
    res.status(HttpStatusResolver.getCode(result.statusCode.toString())).send(result);
  };
}
