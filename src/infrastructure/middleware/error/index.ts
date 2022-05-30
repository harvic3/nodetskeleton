import { HttpStatusResolver } from "../../../adapters/controllers/base/httpResponse/HttpStatusResolver";
import { ApplicationError } from "../../../application/shared/errors/ApplicationError";
import appMessages from "../../../application/shared/locals/messages";
import { Context } from "../../app/core/Modules";
import { ErrorHandler } from "../types";
import { Result } from "result-tsk";
import config from "../../config";

export class ErrorHandlerMiddleware {
  handle: ErrorHandler = (err: ApplicationError, ctx: Context) => {
    const result = new Result();
    if (err?.name.includes("ApplicationError")) {
      console.log("Controlled application error:", err.name, err.message);
      result.setError(err.message, err.errorCode);
    } else {
      // Send to your logger system or repository this error
      console.log("No controlled application error:", err);
      result.setError(
        appMessages.get(config.Params.DefaultApplicationError.Message),
        config.Params.DefaultApplicationError.Code,
      );
    }
    if (ctx.headersSent) {
      return;
    }

    ctx.status = HttpStatusResolver.getCode(result.statusCode.toString());
    ctx.body = result.toResultDto();
  };

  manageNodeException(
    exceptionType: string,
    exception: NodeJS.UncaughtExceptionListener | Promise<unknown>,
  ): void {
    // Send to your logger system or repository this error
    console.log(`Node ${exceptionType} type:`, exception);
  }
}

export default new ErrorHandlerMiddleware();
