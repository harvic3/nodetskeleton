import { StringUtil } from "../../../domain/shared/utils/StringUtil";
import ArrayUtil from "../../../domain/shared/utils/ArrayUtil";
import { Context } from "../../app/core/Modules";
import config from "../../config";

class CorsMiddleware {
  private readonly validOrigins: string[] = config.Server.Origins.split(StringUtil.COMMA_SEPARATOR);
  private readonly allowedMethods: string[] = ["GET", "POST", "PUT", "DELETE", "PATCH"];

  handle = {
    origin: this.verifyOrigin.bind(this),
    allowMethods: this.allowedMethods,
  };

  private verifyOrigin(ctx: Context): string {
    if (ctx.headers.origin) {
      const origin: string = ctx.headers.origin;
      if (this.validOrigins.indexOf(origin) !== ArrayUtil.NOT_FOUND_INDEX) {
        return origin;
      }
    }
    return this.validOrigins[ArrayUtil.FIRST_INDEX];
  }
}

export default new CorsMiddleware();
