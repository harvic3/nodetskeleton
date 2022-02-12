import { StringUtils } from "../../domain/shared/utils/StringUtils";
import { Gender } from "../../domain/user/genre/Gender.enum";
import { IMockBuilder } from "./mockContracts/IMockBuilder";
import { MockConstants } from "./MockConstants";
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
  withName(name = MockConstants.USER_NAME): UserMock {
    this.user.name = name;
    return this;
  }
  withEmail(email = MockConstants.USER_EMAIL): UserMock {
    this.user.email = email;
    return this;
  }
  withGender(gender = Gender.MALE): UserMock {
    this.user.gender = gender;
    return this;
  }
  withPassword(password = MockConstants.EXAMPLE_PASSWORD): UserMock {
    this.user.password = StringUtils.encodeBase64(password);
    return this;
  }
}
