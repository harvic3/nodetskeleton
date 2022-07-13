import { LocaleTypeEnum } from "../../../application/shared/locals/LocaleType.enum";
import appMessages from "../../../application/shared/locals/messages";
import ArrayUtil from "../../../domain/shared/utils/ArrayUtil";
import words from "../../../application/shared/locals/words";
import { Context, Next } from "../../app/core/Modules";
import { Middleware } from "../types";
import config from "../../config";

export class LocalizationMiddleware {
  handle: Middleware = (ctx: Context, next: Next): Promise<void> => {
    const requestLanguage = ctx.headers?.acceptLanguage?.length
      ? ctx.headers.acceptLanguage[ArrayUtil.FIRST_ELEMENT_INDEX]
      : (ctx.headers?.acceptLanguage as LocaleTypeEnum);
    const locale = requestLanguage || config.Params.DefaultLanguage;
    ctx.locale = locale;
    appMessages.init(locale);
    words.init(locale);
    return next();
  };
}

export default new LocalizationMiddleware();
