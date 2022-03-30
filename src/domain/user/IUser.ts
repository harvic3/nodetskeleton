import { Gender } from "./genre/Gender.enum";
import { Email } from "./Email";

export interface IUser {
  uid: string | undefined;
  maskedUid: string | undefined;
  lastName: string | undefined;
  firstName: string | undefined;
  email: Email | string | undefined;
  gender: Gender | undefined;
  verified: boolean | undefined;
  createdAt: string | undefined;
}
