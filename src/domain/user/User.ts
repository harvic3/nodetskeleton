import { ISession } from "../session/ISession";
import { Gender } from "./genre/Gender.enum";
import { IUser } from "./IUser";

export class User implements IUser {
  [optional: string]: unknown | undefined;
  uid: string | undefined;
  maskedUid: string | undefined;
  name: string | undefined;
  email: string | undefined;
  gender: Gender | undefined;
  verified: boolean | undefined;
  createdAt: string | undefined;

  constructor(props?: {
    name: string;
    email: string;
    gender: Gender;
    uid: string;
    maskedUid: string;
    createdAt: string;
    verified: boolean;
  }) {
    this.name = props?.name;
    this.email = props?.email;
    this.gender = props?.gender;
    this.uid = props?.uid;
    this.maskedUid = props?.maskedUid;
    this.createdAt = props?.createdAt;
    this.verified = props?.verified;
  }

  createSession(): ISession {
    return {
      email: this.email,
      emailVerified: this.verified,
      name: this.name,
    } as ISession;
  }
}
