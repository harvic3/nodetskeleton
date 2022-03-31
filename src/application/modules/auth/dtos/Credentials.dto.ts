import { IResult, Resources, Validator } from "../../../shared/useCase/BaseUseCase";
import { Email } from "../../../../domain/user/Email";

export type ICredentials = { email: string | undefined; passwordB64: string | undefined };

export class CredentialsDto {
  email: Email | undefined;
  passwordB64: string | undefined;

  static fromJSON(json: ICredentials): CredentialsDto {
    const credentialsDto = new CredentialsDto();
    credentialsDto.email = new Email(json?.email?.toLowerCase());
    credentialsDto.passwordB64 = json?.passwordB64;

    return credentialsDto;
  }

  isValid(result: IResult, appWords: Resources, validator: Validator): boolean {
    const validations: Record<string, unknown> = {};
    validations[appWords.get(appWords.keys.EMAIL)] = this.email?.value;
    validations[appWords.get(appWords.keys.PASSWORD)] = this.passwordB64;

    return validator.isValidEntry(result, validations);
  }
}
