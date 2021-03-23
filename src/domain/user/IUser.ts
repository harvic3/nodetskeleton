import { Gender } from "./genre/Gender.enum";

export interface IUser {
  uid: string;
  maskedUid: string;
  name: string;
  email: string;
  gender: Gender;
  verified: boolean;
  createdAt: string;
}
