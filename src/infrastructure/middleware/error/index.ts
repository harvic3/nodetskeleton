import { HttpStatusResolver } from "../../../adapters/controllers/base/httpResponse/HttpStatusResolver";
import { ApplicationError } from "../../../application/shared/errors/ApplicationError";
import { Request, Response, NextFunction } from "../../app/core/Modules";
import resources from "../../../application/shared/locals/messages";
import { Result } from "result-tsk";
import config from "../../config";
import { ErrorHandler } from "..";

export class ErrorHandlerMiddleware {
  handle: ErrorHandler = (
    err: ApplicationError,
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const result = new Result();
    if (err?.name.includes("ApplicationError")) {
      console.log("Controlled application error:", err.name, err.message);
      result.setError(err.message, err.errorCode);
    } else {
      // Send to your logger system or repository this error
      console.log("No controlled application error:", err);
      result.setError(
        resources.get(config.Params.DefaultApplicationError.Message),
        config.Params.DefaultApplicationError.Code,
      );
    }
    if (res.headersSent) {
      return next(result);
    }

    return res.status(HttpStatusResolver.getCode(result.statusCode.toString())).send(result);
  };

  manageNodeException(
    exceptionType: string,
    exc: NodeJS.UncaughtExceptionListener | NodeJS.UnhandledRejectionListener,
  ): void {
    // Send to your logger system or repository this error
    console.log(`Node ${exceptionType} type:`, exc);
  }
}

export default new ErrorHandlerMiddleware();
