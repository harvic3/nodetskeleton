import appMessages from "../../../application/shared/locals/messages";
import ArrayUtil from "../../../domain/shared/utils/ArrayUtil";
import { Context, Next } from "../../app/core/Modules";
import { Middleware } from "../types";
import config from "../../config";

export class LocalizationMiddleware {
  handle: Middleware = (ctx: Context, next: Next): Promise<void> => {
    const requestLanguage = ctx.headers?.acceptLanguage?.length
      ? ctx.headers.acceptLanguage[ArrayUtil.FIRST_ELEMENT_INDEX]
      : (ctx.headers?.acceptLanguage as string);
    const language = requestLanguage || config.Params.DefaultLang;
    appMessages.init(language);
    return next();
  };
}

export default new LocalizationMiddleware();
