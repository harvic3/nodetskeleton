import { Request, Response, NextFunction } from "../../server/core/Modules";
import resources from "../../../application/shared/locals/messages";
import words from "../../../application/shared/locals/words";
import config from "../../config";

export class LocalizationMiddleware {
  handler(req: Request, res: Response, next: NextFunction): void {
    const language = req.headers["accept-language"] || config.params.DefaultLang;
    resources.init(language);
    words.init(language);

    return next();
  }
}

export default new LocalizationMiddleware();
