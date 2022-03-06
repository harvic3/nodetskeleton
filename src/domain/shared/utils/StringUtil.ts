import { AppConstants } from "../AppConstants";
import { Nulldifined } from "../Nulldifined";

export class StringUtil {
  static EMPTY = "";

  static isValidAsPassword(password: string | Nulldifined): boolean {
    if (!password) return false;

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  }

  static decodeBase64(base64: string | Nulldifined): string | Nulldifined {
    if (!base64) return null;

    return Buffer.from(base64, AppConstants.BASE64_ENCODING).toString(AppConstants.ASCII_ENCODING);
  }

  static encodeBase64(text: string | Nulldifined): string | Nulldifined {
    if (!text) return null;

    return Buffer.from(text, AppConstants.ASCII_ENCODING).toString(AppConstants.BASE64_ENCODING);
  }
}
