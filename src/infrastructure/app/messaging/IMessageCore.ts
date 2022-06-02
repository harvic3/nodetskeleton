import { MessageQueue } from "../../messaging/MessageQueue";
import { MessageBus } from "../../messaging/MessageBus";

export interface IMessagingCore {
  tskMessageBus?: MessageBus;
  tskMessageQueue?: MessageQueue;

  createBusClients(): void;
  createQueueClients(): void;
  setSubscriptions(): void;
  initializeBusSockets(): void;
  initializeQueueSockets(): void;
  initListeners(): void;
  initialize(): void;
  close(): void;
}
