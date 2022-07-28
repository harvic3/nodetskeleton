import { IResult, Resources, Validator } from "../../../shared/useCase/BaseUseCase";
import { PasswordBuilder } from "../../../../domain/user/PasswordBuilder";
import { Email } from "../../../../domain/user/Email";

export type ICredentials = { email: string | undefined; passwordB64: string | undefined };

export class CredentialsDto {
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

  isValid(result: IResult, appWords: Resources, validator: Validator): boolean {
    const validations: Record<string, unknown> = {};
    validations[appWords.get(appWords.keys.EMAIL)] = !!this.email?.value;
    validations[appWords.get(appWords.keys.PASSWORD)] = !!this.passwordBuilder?.passwordBase64;

    return validator.isValidEntry(result, validations);
  }
}
