import { LocaleTypeEnum } from "../../../application/shared/locals/LocaleType.enum";
import { IRequest } from "../../../adapters/controllers/base/Base.controller";
import { Request, Response, NextFunction } from "../../app/core/Modules";
import appMessages from "../../../application/shared/locals/messages";
import { TypeParser } from "../../../domain/shared/utils/TypeParser";
import appWords from "../../../application/shared/locals/words";
import { Middleware } from "../types";
import config from "../../config";

const getLanguage = (req: Request) => {
  // "pt-BR,pt;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6"
  try {
    const locals = appMessages["values"];
    const language = req.headers["accept-language"] || "";
    const languages = language.split(",");
    for (const key in languages) {
      if (Object.prototype.hasOwnProperty.call(languages, key)) {
        const element = languages[key];
        const lang = element.replace(/;.+/, "");
        if (locals[lang]) {
          return lang as LocaleTypeEnum;
        }
      }
    }
  } catch {}

  return config.Params.DefaultLanguage;
};

export class LocalizationMiddleware {
  handle: Middleware = (req: Request, _res: Response, next: NextFunction) => {
    const locale = getLanguage(req);
    TypeParser.cast<IRequest>(req).locale = locale;
    appMessages.init(locale);
    appWords.init(locale);
    return next();
  };
}

export default new LocalizationMiddleware();
