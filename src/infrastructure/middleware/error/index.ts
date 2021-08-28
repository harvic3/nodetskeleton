import { HttpStatusResolver } from "../../../adapters/controllers/base/httpResponse/HttpStatusResolver";
import { ApplicationError } from "../../../application/shared/errors/ApplicationError";
import { Request, Response, NextFunction } from "../../app/core/Modules";
import resources from "../../../application/shared/locals/messages";
import { Result } from "result-tsk";
import config from "../../config";

export class ErrorHandlerMiddleware {
  handle(err: ApplicationError, req: Request, res: Response, next: NextFunction): void {
    const result = new Result();
    if (err?.name === "ApplicationError") {
      console.log("Controlled application error:", err.message);
      result.setError(err.message, err.errorCode);
    } else {
      // Send to your log this error
      console.log("No controlled application error:", err);
      result.setError(
        resources.get(config.Params.DefaultApplicationError.Message),
        config.Params.DefaultApplicationError.Code,
      );
    }
    if (res.headersSent) {
      return next(result);
    }
    res.status(HttpStatusResolver.getCode(result.statusCode.toString())).send(result);
  }

  manageNodeException(
    exceptionType: string,
    exc: NodeJS.UncaughtExceptionListener | NodeJS.UnhandledRejectionListener,
  ): void {
    console.log(`Node ${exceptionType} type:`, exc);
  }
}

export default new ErrorHandlerMiddleware();
