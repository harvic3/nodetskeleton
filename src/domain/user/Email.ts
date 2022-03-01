import { StringUtils } from "../shared/utils/StringUtils";
import { Nulldifined } from "../shared/Nulldifined";

export class Email {
  constructor(readonly value: string | Nulldifined) {}

  isValid(): boolean {
    return StringUtils.isValidAsEmail(this.value);
  }
}
