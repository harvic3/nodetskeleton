import { AppConstants } from "../AppConstants";

export class StringUtils {
  static isValidAsPassword(password: string): boolean {
    if (!password) return false;

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  }

  static decodeBase64(base64: string): string {
    if (!base64) return null;

    return Buffer.from(base64, AppConstants.BASE64_ENCODING).toString(AppConstants.ASCII_ENCODING);
  }

  static encodeBase64(text: string): string {
    if (!text) return null;

    return Buffer.from(text, AppConstants.ASCII_ENCODING).toString(AppConstants.BASE64_ENCODING);
  }
}
