import { Request, Response, NextFunction } from "../../app/core/Modules";
import appMessages from "../../../application/shared/locals/messages";
import appWords from "../../../application/shared/locals/words";
import { Middleware } from "../types";
import config from "../../config";

export class LocalizationMiddleware {
  handle: Middleware = (req: Request, _res: Response, next: NextFunction) => {
    const language = req.headers["accept-language"] || config.Params.DefaultLang;
    appMessages.init(language);
    appWords.init(language);

    return next();
  };
}

export default new LocalizationMiddleware();
