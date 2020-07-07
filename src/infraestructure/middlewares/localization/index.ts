// // For KoaJS
// import { Context, Next } from "../../config";
// import Resource from "../../locals/index";

// export default function () {
//   return async function (ctx: Context, next: Next): Promise<void> {
//     Resource.Init(ctx.headers.acceptLanguage || ctx.request.query.lang || "en");
//     await next();
//   };
// }

// For ExpressJS
import { Request, Response, NextFunction } from "../../config";
import resources from "../../locals/index";

export default function () {
  return function (req: Request, res: Response, next: NextFunction): void {
    resources.Init(req.headers["accept-language"] || "en");
    next();
  };
}
