// For KoaJs
// import { Context, Next } from "../../server/CoreModules";
// import resources from "../../../application/shared/locals/index";

// export default function () {
//   return async function (ctx: Context, next: Next): Promise<void> {
//     resources.Init(ctx.headers.acceptLanguage);
//     await next();
//   };
// }

// For ExpressJs
import { Request, Response, NextFunction } from "../../server/CoreModules";
import resources from "../../../application/shared/locals/index";

export default function () {
  return function (req: Request, res: Response, next: NextFunction): void {
    resources.Init(req.headers["accept-language"]);
    next();
  };
}
