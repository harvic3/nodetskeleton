import { Gender } from "./genre/Gender.enum";

export interface IUser {
  uid: string | undefined;
  maskedUid: string | undefined;
  name: string | undefined;
  email: string | undefined;
  gender: Gender | undefined;
  verified: boolean | undefined;
  createdAt: string | undefined;
}
