import { Nulldifined } from "../shared/Nulldifined";

export class Email {
  constructor(readonly value: string | Nulldifined) {}

  isValid(): boolean {
    if (!this.value) return false;
    const emailRegex =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(this.value);
  }
}
