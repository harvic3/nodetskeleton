import { HttpStatusResolver } from "../../../adapters/controllers/base/httpResponse/HttpStatusResolver";
import { ApplicationError } from "../../../application/shared/errors/ApplicationError";
import { Request, Response, NextFunction } from "../../server/core/Modules";
import resources from "../../../application/shared/locals/messages";
import { Result } from "result-tsk";
import config from "../../config";

export class HandlerErrorMiddleware {
  handler(err: ApplicationError, req: Request, res: Response, next: NextFunction): void {
    const result = new Result();
    if (err?.name === "ApplicationError") {
      console.log("Controlled application error:", err.message);
      result.setError(err.message, err.errorCode);
    } else {
      // Send to your log this error
      console.log("No controlled application error:", err);
      result.setError(
        resources.get(config.params.defaultApplicationError.Message),
        config.params.defaultApplicationError.Code,
      );
    }
    if (res.headersSent) {
      return next(result);
    }
    res.status(HttpStatusResolver.getCode(result.statusCode.toString())).send(result);
  }
}

export default new HandlerErrorMiddleware();
