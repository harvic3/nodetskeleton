export class PasswordBuilder {
  readonly value: string;

  constructor(email: string, password: string) {
    this.value = `${email}-${password}`;
  }
}
