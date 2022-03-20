import { ISession } from "../session/ISession";
import { Gender } from "./genre/Gender.enum";
import { Email } from "./Email";
import { IUser } from "./IUser";

export class User implements IUser {
  [optional: string]: unknown | undefined;
  uid: string | undefined;
  maskedUid: string | undefined;
  name: string | undefined;
  email: Email | undefined;
  gender: Gender | undefined;
  verified: boolean | undefined;
  createdAt: string | undefined;

  constructor(props?: {
    name: string | undefined;
    email: string | undefined;
    gender: Gender | undefined;
    uid: string | undefined;
    maskedUid: string | undefined;
    createdAt: string | undefined;
    verified: boolean | undefined;
  }) {
    this.name = props?.name;
    this.email = new Email(props?.email?.toLowerCase());
    this.gender = props?.gender;
    this.uid = props?.uid;
    this.maskedUid = props?.maskedUid;
    this.createdAt = props?.createdAt;
    this.verified = props?.verified;
  }

  createSession(sessionId: string): ISession {
    return {
      sessionId,
      email: this.email?.value,
      emailVerified: this.verified,
      name: this.name,
    } as ISession;
  }

  static fromIUser(user: IUser): User {
    return new User({
      name: user.name,
      email: user.email?.value as string,
      createdAt: user.createdAt,
      gender: user.gender,
      maskedUid: user.maskedUid,
      uid: user.uid,
      verified: user.verified,
    });
  }
}
