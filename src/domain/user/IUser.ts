import { Gender } from "./genre/Gender.enum";
import { Email } from "./Email";

export interface IUser {
  uid: string | undefined;
  maskedUid: string | undefined;
  name: string | undefined;
  email: Email | undefined;
  gender: Gender | undefined;
  verified: boolean | undefined;
  createdAt: string | undefined;
}
