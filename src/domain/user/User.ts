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

  constructor(properties?: {
    name: string;
    email: string;
    gender: Gender;
    uid: string;
    maskedUid: string;
    createdAt: string;
    verified: boolean;
  }) {
    this.name = properties?.name;
    this.email = properties?.email;
    this.gender = properties?.gender;
    this.uid = properties?.uid;
    this.maskedUid = properties?.maskedUid;
    this.createdAt = properties?.createdAt;
    this.verified = properties?.verified;
  }

  createSession(): ISession {
    return {
      email: this.email,
      emailVerified: this.verified,
      name: this.name,
    } as ISession;
  }
}
