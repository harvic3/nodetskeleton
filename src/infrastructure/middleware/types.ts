import { ApplicationError } from "../../application/shared/errors/ApplicationError";
import { NextFunction, Request, Response } from "../app/core/Modules";

type Middleware = (req: Request, res: Response, next: NextFunction) => void;
type ErrorHandler = (
  err: ApplicationError,
  req: Request,
  res: Response,
  next: NextFunction,
) => void;

export { Middleware, ErrorHandler };
