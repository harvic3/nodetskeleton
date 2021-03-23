import { Request, Response, NextFunction } from "../../server/core/Modules";
import resources from "../../../application/shared/locals/messages";
import config from "../../config";

export class LocalizationMiddleware {
  handler(req: Request, res: Response, next: NextFunction): void {
    resources.init(req.headers["accept-language"] || config.params.DefaultLang);
    return next();
  }
}

export default new LocalizationMiddleware();
