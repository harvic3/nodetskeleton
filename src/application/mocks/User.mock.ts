import { Gender } from "../../domain/user/genre/Gender.enum";
import { IUserDto } from "../modules/users/dtos/User.dto";
import { MockBuilder } from "./builder/mockBuilder.mock";
import { MockConstants } from "./MockConstants.mock";
import { Email } from "../../domain/user/Email";
import { User } from "../../domain/user/User";

export class UserMock extends MockBuilder<User> {
  constructor() {
    super();
    this.reset();
  }

  private initialize(): User {
    const user = new User();
    user.uid = MockConstants.USER_ID;
    user.maskedUid = MockConstants.USER_MASKED_ID;

    return user;
  }

  reset(): User {
    this.mock = this.initialize();

    return this.mock;
  }

  byDefault(): UserMock {
    this.create(this.initialize())
      .setStrProp("firstName")
      .setStrProp("lastName")
      .setProp("email", new Email(MockConstants.USER_EMAIL))
      .setStrProp("gender", Gender.MALE);

    return this;
  }

  withSpecificName(firstName: string, lastName: string): UserMock {
    this.byDefault().setStrProp("firstName", firstName).setStrProp("lastName", lastName);

    return this;
  }

  fromJSON(user: IUserDto, uid: string, maskedUid: string): UserMock {
    this.create(new User())
      .setStrProp("uid", uid)
      .setStrProp("maskedUid", maskedUid)
      .setStrProp("firstName", user.firstName)
      .setStrProp("lastName", user.lastName)
      .setProp("email", new Email(user.email as string))
      .setStrProp("gender", user.gender);

    return this;
  }
}
