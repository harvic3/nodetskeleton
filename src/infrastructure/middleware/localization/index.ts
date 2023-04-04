import { LocaleTypeEnum } from "../../../application/shared/locals/LocaleType.enum";
import { IRequest } from "../../../adapters/controllers/base/Base.controller";
import { Request, Response, NextFunction } from "../../app/core/Modules";
import { DefaultValue } from "../../../domain/shared/utils/DefaultValue";
import appMessages from "../../../application/shared/locals/messages";
import { TypeParser } from "../../../domain/shared/utils/TypeParser";
import appWords from "../../../application/shared/locals/words";
import { Middleware } from "../types";
import config from "../../config";

export class LocalizationMiddleware {
  handle: Middleware = (req: Request, _res: Response, next: NextFunction) => {
    const locale = DefaultValue.evaluateAndGet(
      req.headers["accept-language"] as LocaleTypeEnum,
      config.Params.DefaultLanguage,
    );
    TypeParser.cast<IRequest>(req).locale = locale;
    appMessages.init(locale);
    appWords.init(locale);
    return next();
  };
}

export default new LocalizationMiddleware();
