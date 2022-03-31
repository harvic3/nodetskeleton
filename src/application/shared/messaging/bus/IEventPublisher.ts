import { IEventConnection } from "../IEventConnection";
import { EventMessage } from "../EventMessage";

export interface IEventPublisher extends IEventConnection {
  publish<T>(message: EventMessage<T>): Promise<boolean>;
}
