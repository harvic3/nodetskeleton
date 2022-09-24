import { Nulldefined } from "../types/Nulldefined.type";
import { AppConstants } from "../AppConstants";

export class StringUtil {
  static DOT = ".";
  static EMPTY = "";
  static WHITE_SPACE = " ";
  static COMMA_SPACE_SEPARATOR = ", ";

  static decodeBase64(base64: string | Nulldefined): string | Nulldefined {
    if (!base64) return null;

    return Buffer.from(base64, AppConstants.BASE64_ENCODING).toString(AppConstants.ASCII_ENCODING);
  }

  static encodeBase64(text: string | Nulldefined): string | Nulldefined {
    if (!text) return null;

    return Buffer.from(text, AppConstants.ASCII_ENCODING).toString(AppConstants.BASE64_ENCODING);
  }

  static cleanWhiteSpace(text: string | Nulldefined): string | Nulldefined {
    if (!text) return null;

    return text.replace(/\s/g, StringUtil.EMPTY);
  }
}
