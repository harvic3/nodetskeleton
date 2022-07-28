import { StringUtil } from "../shared/utils/StringUtil";

export class PasswordBuilder {
  readonly value: string;
  readonly passwordBase64: string;

  constructor(email: string, passwordBase64: string) {
    this.value = `${email}-${passwordBase64}`;
    this.passwordBase64 = passwordBase64;
  }

  isValid(): boolean {
    if (!this.passwordBase64) return false;

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(StringUtil.decodeBase64(this.passwordBase64) as string);
  }
}
