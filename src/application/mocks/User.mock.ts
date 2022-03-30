import { StringUtil } from "../../domain/shared/utils/StringUtil";
import { Gender } from "../../domain/user/genre/Gender.enum";
import { IMockBuilder } from "./mockContracts/IMockBuilder";
import { MockConstants } from "./MockConstants";
import { Email } from "../../domain/user/Email";
import { User } from "../../domain/user/User";

export class UserMock implements IMockBuilder<User> {
  private user: User;

  constructor() {
    this.user = new User();
    this.user.uid = MockConstants.USER_ID;
    this.user.maskedUid = MockConstants.USER_MASKED_ID;
  }

  reset(): User {
    this.user = new User();
    this.user.uid = MockConstants.USER_ID;
    this.user.maskedUid = MockConstants.USER_MASKED_ID;
    return this.user;
  }
  build(): User {
    return this.user;
  }
  withFirstName(firstName = MockConstants.USER_FIRST_NAME): UserMock {
    this.user.firstName = firstName;
    return this;
  }
  withLastName(lastName = MockConstants.USER_LAST_NAME): UserMock {
    this.user.firstName = lastName;
    return this;
  }
  withEmail(email = MockConstants.USER_EMAIL): UserMock {
    this.user.email = new Email(email);
    return this;
  }
  withGender(gender = Gender.MALE): UserMock {
    this.user.gender = gender;
    return this;
  }
}
