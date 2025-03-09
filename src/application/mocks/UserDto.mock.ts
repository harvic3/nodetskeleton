import { StringUtil } from "../../domain/shared/utils/StringUtil";
import { Gender } from "../../domain/user/genre/Gender.enum";
import { IUserDto } from "../modules/users/dtos/User.dto";
import { MockBuilder } from "./builder/mockBuilder.mock";
import { MockConstants } from "./MockConstants.mock";

export class UserDtoMock extends MockBuilder<IUserDto> {
  constructor() {
    super();
    this.reset();
  }

  private initialize(): IUserDto {
    return {
      firstName: undefined,
      lastName: undefined,
      email: undefined,
      passwordB64: undefined,
      gender: undefined,
    };
  }

  reset(): IUserDto {
    this.mock = this.initialize();

    return this.mock;
  }

  byDefault(): UserDtoMock {
    this.create(this.initialize())
      .setStrProp("firstName")
      .setStrProp("lastName")
      .setStrProp("email", MockConstants.USER_EMAIL)
      .setStrProp("gender", Gender.FEMALE)
      .setStrProp("passwordB64", StringUtil.encodeBase64(MockConstants.EXAMPLE_PASSWORD) as string);

    return this;
  }

  withoutPassword(): UserDtoMock {
    this.byDefault().deleteProp("passwordB64");

    return this;
  }

  withSpecificName(firstName: string, lastName: string): UserDtoMock {
    this.byDefault().setStrProp("firstName", firstName).setStrProp("lastName", lastName);

    return this;
  }

  withWrongEmail(wrongEmail: string): UserDtoMock {
    this.byDefault().setStrProp("email", wrongEmail);

    return this;
  }

  withWrongPassword(wrongPassword: string): UserDtoMock {
    this.byDefault().setStrProp("passwordB64", StringUtil.encodeBase64(wrongPassword) as string);

    return this;
  }
}
