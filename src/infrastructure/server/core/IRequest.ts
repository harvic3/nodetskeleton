import { ISession } from "../../../domain/session/ISession";
import { Request as ServerRequest } from "express";

export interface IRequest extends ServerRequest {
  session: ISession;
}
