import { HttpStatusResolver } from "../../../adapters/controllers/base/httpResponse/HttpStatusResolver";
import { ILogProvider } from "../../../application/shared/log/providerContracts/ILogProvider";
import { ApplicationStatus } from "../../../application/shared/status/applicationStatus";
import { ApplicationError } from "../../../application/shared/errors/ApplicationError";
import kernel, { LogProvider } from "../../../adapters/providers/container";
import { Request, Response, NextFunction } from "../../app/core/Modules";
import resources from "../../../application/shared/locals/messages";
import { ErrorLog } from "../../../application/shared/log/ErrorLog";
import { ErrorHandler } from "../types";
import { Result } from "result-tsk";
import config from "../../config";

export class ErrorHandlerMiddleware {
  constructor(private readonly logProvider: ILogProvider) {}

  handle: ErrorHandler = (
    err: ApplicationError,
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const result = new Result();
    if (err?.name?.includes(ApplicationError.name)) {
      this.logProvider.logWarning(err);
      result.setError(err.message, err.errorCode);
    } else {
      // Send to your logger system or repository this error
      this.logProvider.logError(
        new ErrorLog({
          context: ErrorHandlerMiddleware.name,
          name: "UncontrolledError",
          message: err.message,
          stack: err.stack ?? JSON.stringify(err),
          metadata: { body: req.body, params: req.params, query: req.query, path: req.path },
        }),
      );
      result.setError(
        resources.get(config.Params.DefaultApplicationError.MessageKey),
        config.Params.DefaultApplicationError.Code,
      );
    }
    if (res.headersSent) return next(result);

    return res
      .status(HttpStatusResolver.getCode(config.Params.DefaultApplicationError.Code))
      .send(result);
  };

  manageNodeException(
    exceptionType: string,
    error: Error,
    origin: NodeJS.UncaughtExceptionOrigin,
  ): void {
    this.logProvider.logError({
      context: ErrorHandlerMiddleware.name,
      name: exceptionType,
      message: `Node ${exceptionType}`,
      stack: undefined,
      metadata: { error: new Error(exceptionType, { cause: error }), origin },
    });
  }

  manageNodeRejection(exceptionType: string, reason: unknown, promise: Promise<unknown>): void {
    this.logProvider.logError({
      context: ErrorHandlerMiddleware.name,
      name: exceptionType,
      message: `Node ${exceptionType}`,
      stack: undefined,
      metadata: { error: new Error(exceptionType, { cause: reason }), promise },
    });
  }
}

export default new ErrorHandlerMiddleware(
  kernel.get(ErrorHandlerMiddleware.name, LogProvider.name),
);
