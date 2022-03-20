export interface ISession {
  sessionId: string;
  maskedUserUid: string;
  email: string;
  emailVerified: boolean;
  name: string;
  iat: number;
  exp: number;
}
