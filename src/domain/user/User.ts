import { ISession } from "../session/ISession";
import { Gender } from "./genre/Gender.enum";
import { ILastLogin } from "./ILastLogin";
import { Email } from "./Email";
import { IUser } from "./IUser";

export class User implements IUser {
  [optional: string]: unknown | undefined;
  uid: string | undefined;
  maskedUid: string | undefined;
  firstName: string | undefined;
  lastName: string | undefined;
  email: Email | undefined;
  gender: Gender | undefined;
  verified: boolean | undefined;
  createdAt: string | undefined;
  lastLogin: ILastLogin | undefined;

  constructor(props?: {
    uid: string | undefined;
    maskedUid: string | undefined;
    firstName: string | undefined;
    lastName: string | undefined;
    email: string | undefined;
    gender: Gender | undefined;
    createdAt: string | undefined;
    verified: boolean | undefined;
    lastLogin?: ILastLogin;
  }) {
    this.uid = props?.uid;
    this.maskedUid = props?.maskedUid;
    this.firstName = props?.firstName;
    this.lastName = props?.lastName;
    this.email = new Email(props?.email?.toLowerCase());
    this.gender = props?.gender;
    this.createdAt = props?.createdAt;
    this.verified = props?.verified;
    this.lastLogin = props?.lastLogin;
  }

  createSession(sessionId: string): ISession {
    return {
      sessionId,
      email: this.email?.value,
      emailVerified: this.verified,
      name: this.firstName,
      maskedUserUid: this.maskedUid,
    } as ISession;
  }

  setLastLogin(loginAt: string, client: string, ip: string): void {
    this.lastLogin = {
      loginAt,
      userAgent: client,
      ipAddress: ip,
    };
  }
}
