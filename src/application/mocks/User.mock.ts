import { Gender } from "../../domain/user/genre/Gender.enum";
import { IMockBuilder } from "./mockContracts/IMockBuilder";
import { User } from "../../domain/user/User";

export class UserMock implements IMockBuilder<User> {
  private user: User;
  constructor() {
    this.user = new User();
    this.user.uid = "a1b2c3d4e5f6";
    this.user.maskedUid = "f6e5d4c3b2a1";
  }

  reset(): User {
    this.user = new User();
    this.user.uid = "a1b2c3d4e5f6";
    this.user.maskedUid = "f6e5d4c3b2a1";
    return this.user;
  }
  build(): User {
    return this.user;
  }
  withName(name = "Nikola Tesla"): UserMock {
    this.user.name = name;
    return this;
  }
  withEmail(email = "nikolatesla@elion.com"): UserMock {
    this.user.email = email;
    return this;
  }
  withGender(gender = Gender.MALE): UserMock {
    this.user.gender = gender;
    return this;
  }
  withPassword(password = "Tm9kZVRza2VsZXRvbg=="): UserMock {
    this.user.password = password;
    return this;
  }
}
