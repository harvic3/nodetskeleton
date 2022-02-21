import { ISession } from "../../../domain/session/ISession";
import { RequestBase } from "./ServerModules";

export interface IRequest extends RequestBase {
  session: ISession;
}
