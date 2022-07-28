import { AppConstants } from "../AppConstants";
import { Nulldifined } from "../Nulldifined";

export class StringUtil {
  static EMPTY = "";
  static WHITE_SPACE = " ";
  static COMMA_SPACE_SEPARATOR = ", ";

  static decodeBase64(base64: string | Nulldifined): string | Nulldifined {
    if (!base64) return null;

    return Buffer.from(base64, AppConstants.BASE64_ENCODING).toString(AppConstants.ASCII_ENCODING);
  }

  static encodeBase64(text: string | Nulldifined): string | Nulldifined {
    if (!text) return null;

    return Buffer.from(text, AppConstants.ASCII_ENCODING).toString(AppConstants.BASE64_ENCODING);
  }

  static cleanWhiteSpace(text: string | Nulldifined): string | Nulldifined {
    if (!text) return null;

    return text.replace(/\s/g, StringUtil.EMPTY);
  }
}
