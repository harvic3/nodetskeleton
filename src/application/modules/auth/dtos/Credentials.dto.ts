import { PasswordBuilder } from "../../../../domain/user/PasswordBuilder";
import { BaseDto, IResult } from "../../../shared/dto/BaseDto";
import { Email } from "../../../../domain/user/Email";

export type ICredentials = { email: string | undefined; passwordB64: string | undefined };

export class CredentialsDto extends BaseDto {
  email: Email | undefined;
  passwordBuilder: PasswordBuilder | undefined;

  static fromJSON(json: ICredentials): CredentialsDto {
    const credentialsDto = new CredentialsDto();
    credentialsDto.email = new Email(json?.email?.toLowerCase());
    credentialsDto.passwordBuilder = new PasswordBuilder(
      json?.email?.toLowerCase() as string,
      json?.passwordB64 as string,
    );

    return credentialsDto;
  }

  isValid(result: IResult): boolean {
    const validations: Record<string, unknown> = {};
    validations[this.appWords.get(this.appWords.keys.EMAIL)] = !!this.email?.value;
    validations[this.appWords.get(this.appWords.keys.PASSWORD)] =
      !!this.passwordBuilder?.passwordBase64;

    return this.validator.isValidEntry(result, validations);
  }
}
