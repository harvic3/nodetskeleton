// For KoaJs
// import { Context, Next } from "../../server/CoreModules";
// import resources from "../../../application/shared/locals/index";

// export default function () {
//   return async function (ctx: Context, next: Next): Promise<void> {
//     resources.init(ctx.headers.acceptLanguage);
//     await next();
//   };
// }

// For ExpressJs
import { Request, Response, NextFunction } from "../../server/CoreModules";
import resources from "../../../application/shared/locals/index";
import config from "../../config";

export class LocalizationMiddleware {
  handler(req: Request, res: Response, next: NextFunction): void {
    resources.init(req.headers["accept-language"] || config.params.defaultLang);
    return next();
  }
}

export default new LocalizationMiddleware();
