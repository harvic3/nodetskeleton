export interface ISession {
  maskedUserUid: string;
  email: string;
  emailVerified: boolean;
  name: string;
  iat: number;
  exp: number;
}
