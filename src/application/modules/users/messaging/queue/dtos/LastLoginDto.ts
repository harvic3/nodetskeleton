import { ILastLogin } from "../../../../../../domain/user/ILastLogin";

export class LastLoginDto implements ILastLogin {
  userUid: string;
  loginAt: string;
  userAgent: string;
  ipAddress: string;

  constructor(props: { userUid: string; loginAt: string; ipAddress: string; userAgent: string }) {
    this.userUid = props.userUid;
    this.loginAt = props.loginAt;
    this.ipAddress = props.ipAddress;
    this.userAgent = props.userAgent;
  }
}
