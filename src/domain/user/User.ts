import { ISession } from "../session/ISession";
import { Gender } from "./genre/Gender.enum";
import { IUser } from "./IUser";

export class User implements IUser {
  [optional: string]: unknown;
  uid: string;
  maskedUid: string;
  name: string;
  email: string;
  gender: Gender;
  verified: boolean;
  createdAt: string;

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
