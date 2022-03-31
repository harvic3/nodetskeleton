import { IEventConnection } from "../IEventConnection";

export interface IEventListener extends IEventConnection {
  listen(): void;
}
