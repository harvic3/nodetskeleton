import { LocaleTypeEnum } from "../../../application/shared/locals/LocaleType.enum";
import { IRequest } from "../../../adapters/controllers/base/Base.controller";
import { Request, Response, NextFunction } from "../../app/core/Modules";
import { TypeParser } from "../../../domain/shared/utils/TypeParser";
import { StringUtil } from "../../../domain/shared/utils/StringUtil";
import { Middleware } from "../types";
import config from "../../config";

export class LocalizationMiddleware {
  handle: Middleware = (req: Request, _res: Response, next: NextFunction) => {
    const locale = LocalizationMiddleware.getLanguage(req);
    TypeParser.cast<IRequest>(req).locale = locale;

    return next();
  };

  private static getLanguage(req: Request): LocaleTypeEnum {
    const acceptLanguage = req.headers["accept-language"];
    if (!acceptLanguage) return config.Params.DefaultLanguage;

    const languages =
      acceptLanguage.split(StringUtil.COMMA)?.map((lang) => {
        const [language, qValue] = lang.split(";q=");
        return {
          language: language.trim(),
          q: qValue ? parseFloat(qValue) : 1.0,
        };
      }) ?? [];

    if (!languages.length) return config.Params.DefaultLanguage;

    languages.sort((a, b) => b.q - a.q);

    const candidateLanguages = languages.find((lang) =>
      Object.values(LocaleTypeEnum).includes(lang.language as LocaleTypeEnum),
    )?.language as LocaleTypeEnum;

    return candidateLanguages ?? config.Params.DefaultLanguage;
  }
}

export default new LocalizationMiddleware();
