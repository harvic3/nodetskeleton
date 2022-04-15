import { ApplicationError } from "../../application/shared/errors/ApplicationError";
import { Next, Context } from "../app/core/Modules";

type Middleware = (ctx: Context, next: Next) => Promise<void>;
type ErrorHandler = (err: ApplicationError, ctx: Context) => void;

export { Middleware, ErrorHandler };
