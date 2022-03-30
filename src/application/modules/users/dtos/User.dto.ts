import { IResult, Resource, Validator } from "../../../shared/useCase/BaseUseCase";
import { Gender } from "../../../../domain/user/genre/Gender.enum";
import { User } from "../../../../domain/user/User";

export type IUserDto = {
  firstName: string | undefined;
  lastName: string | undefined;
  email: string | undefined;
  password?: string | undefined;
  gender: Gender | undefined;
};

export class UserDto {
  uid: string | undefined;
  maskedUid: string | undefined;
  email: string | undefined;
  password: string | undefined;
  firstName: string | undefined;
  lastName: string | undefined;
  gender: Gender | undefined;
  phone: string | undefined;
  birthDate: string | undefined;

  static fromJSON(json: IUserDto): UserDto {
    const userDto = new UserDto();
    userDto.email = json?.email?.toLowerCase();
    userDto.password = json.password;
    userDto.firstName = json.firstName;
    userDto.lastName = json.lastName;
    userDto.gender = json.gender;

    return userDto;
  }

  isValid(result: IResult, appWords: Resource, validator: Validator): boolean {
    const validations: Record<string, unknown> = {};
    validations[appWords.values.get(appWords.keys.FIRST_NAME)] = this.firstName;
    validations[appWords.values.get(appWords.keys.LAST_NAME)] = this.lastName;
    validations[appWords.values.get(appWords.keys.EMAIL)] = this.email;
    validations[appWords.values.get(appWords.keys.PASSWORD)] = this.password;
    validations[appWords.values.get(appWords.keys.GENDER)] = this.gender;

    return validator.isValidEntry(result, validations);
  }

  toDomain(uid: string | undefined, maskedUid: string, createdAt: string, verified: boolean): User {
    const user = new User({
      uid,
      maskedUid,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      gender: this.gender,
      createdAt: createdAt,
      verified: verified,
    });
    user.password = this.password;

    return user;
  }
}
