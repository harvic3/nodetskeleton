import config from "../../config";
import { Context, Next } from "../../server/CoreModules";
import resources from "../../../application/shared/locals/index";

export default function () {
  return async function (ctx: Context, next: Next): Promise<void> {
    resources.Init(ctx.headers.acceptLanguage || config.params.defaultLang);
    await next();
  };
}
