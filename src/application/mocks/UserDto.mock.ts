import { StringUtil } from "../../domain/shared/utils/StringUtil";
import { Gender } from "../../domain/user/genre/Gender.enum";
import { IMockBuilder } from "./mockContracts/IMockBuilder";
import { IUserDto } from "../modules/users/dtos/User.dto";
import { MockConstants } from "./MockConstants";

export class UserDtoMock implements IMockBuilder<IUserDto> {
  private userDto: IUserDto;

  constructor() {
    this.userDto = {
      firstName: undefined,
      lastName: undefined,
      email: undefined,
      passwordB64: undefined,
      gender: undefined,
    };
  }

  reset(): IUserDto {
    this.userDto = {
      firstName: undefined,
      lastName: undefined,
      email: undefined,
      passwordB64: undefined,
      gender: undefined,
    };
    return this.userDto;
  }
  build(): IUserDto {
    return this.userDto;
  }
  withFirstName(firstName = MockConstants.USER_FIRST_NAME): UserDtoMock {
    this.userDto.firstName = firstName;
    return this;
  }
  withLastName(lastName = MockConstants.USER_LAST_NAME): UserDtoMock {
    this.userDto.lastName = lastName;
    return this;
  }
  withEmail(email = MockConstants.USER_EMAIL): UserDtoMock {
    this.userDto.email = email;
    return this;
  }
  withGender(gender = Gender.MALE): UserDtoMock {
    this.userDto.gender = gender;
    return this;
  }
  withPassword(password = MockConstants.EXAMPLE_PASSWORD): UserDtoMock {
    this.userDto.passwordB64 = StringUtil.encodeBase64(password) as string;
    return this;
  }
}
