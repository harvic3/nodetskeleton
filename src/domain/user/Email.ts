import { Nulldefined } from "../shared/types/Nulldefined.type";

export class Email {
  constructor(readonly value: string | Nulldefined) {}

  isValid(): boolean {
    if (!this.value) return false;
    const emailRegex =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[\d]{1,3}\.[\d]{1,3}\.[\d]{1,3}\.[\d]{1,3}\])|(([a-zA-Z\-\d]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(this.value);
  }
}
