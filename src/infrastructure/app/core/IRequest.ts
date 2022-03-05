import { ISession } from "../../../domain/session/ISession";
import { RequestBase } from "./ServerModules";

export interface IRequest extends RequestBase {
  isWhiteList: boolean;
  session: ISession;
}
