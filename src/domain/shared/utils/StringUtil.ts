import { Nulldefined } from "../types/Nulldefined.type";
import { AppConstants } from "../AppConstants";

export class StringUtil {
  static readonly DOT = ".";
  static readonly EMPTY = "";
  static readonly WHITE_SPACE = " ";
  static readonly COMMA_SPACE_SEPARATOR = ", ";
  static readonly COMMA = ",";
  static readonly SLASH = "/";

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

  static capitalize(text: string): string {
    if (!text) return StringUtil.EMPTY;

    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  static getRandomString(params: { min: number; max: number }): string {
    const characters = "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz ";
    const length = Math.floor(Math.random() * (params.max - params.min + 1)) + params.min;
    let result = StringUtil.EMPTY;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return result;
  }
}
