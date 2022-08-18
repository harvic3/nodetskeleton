import { EventQueue, QueueClientEnum } from "../../../adapters/messaging/queue/container";
import { ChannelNameEnum } from "../../../application/shared/messaging/ChannelName.enum";
import { Listener, MessageBus, Publisher, Subscriber } from "../../messaging/MessageBus";
import { QueueListener } from "../../../adapters/messaging/queue/listener/QueueListener";
import AppSettings from "../../../application/shared/settings/AppSettings";
import { ServiceContext } from "../../../adapters/shared/ServiceContext";
import { ClientModeEnum } from "../../messaging/ClientMode.enum";
import { MessageQueue } from "../../messaging/MessageQueue";
import kernel from "../../../adapters/shared/kernel";
import {
  EventClientEnum,
  EventPublisher,
  EventSubscriber,
  EventListener,
} from "../../../adapters/messaging/bus/container";

export class MessagingCore {
  tskMessageBus: MessageBus;
  tskMessageQueue: MessageQueue;

  constructor() {
    this.tskMessageBus = this.createMessageBus();
    this.tskMessageBus.initialize();
    this.tskMessageQueue = this.createMessageQueue();
    this.tskMessageQueue.initialize(ClientModeEnum.PUB_MODE);
  }

  private createMessageBus(): MessageBus {
    const connectionOpts = {
      host: AppSettings.MessageBusConnection.Host,
      port: AppSettings.MessageBusConnection.Port,
      dbIndex: AppSettings.MessageBusConnection.DbIndex,
    };
    return new MessageBus(EventClientEnum.TSK_MESSAGE_BUS, connectionOpts);
  }

  private createMessageQueue(): MessageQueue {
    const connectionOpts = {
      host: AppSettings.MessageQueueConnection.Host,
      port: AppSettings.MessageQueueConnection.Port,
      dbIndex: AppSettings.MessageQueueConnection.DbIndex,
    };
    return new MessageQueue(QueueClientEnum.TSK_QUEUE, connectionOpts);
  }

  private setSubscriptions(): void {
    const channelsToSuscribe: ChannelNameEnum[] = [];

    switch (AppSettings.ServiceContext) {
      case ServiceContext.USERS:
        channelsToSuscribe.push(ChannelNameEnum.QUEUE_SECURITY);
        break;
      case ServiceContext.SECURITY:
        channelsToSuscribe.push(ChannelNameEnum.QUEUE_USERS);
        break;
      default:
        channelsToSuscribe.push(ChannelNameEnum.QUEUE_USERS);
        channelsToSuscribe.push(ChannelNameEnum.QUEUE_SECURITY);
        break;
    }

    for (const channel of channelsToSuscribe) {
      kernel
        .get<EventSubscriber>(MessagingCore.name, EventClientEnum.TSK_BUS_SUBSCRIBER)
        .subscribe(channel);
    }
  }

  private initializeBusSockets(): void {
    kernel
      .get<EventSubscriber>(MessagingCore.name, EventClientEnum.TSK_BUS_SUBSCRIBER)
      .initialize(this.tskMessageBus?.getSubscriber() as Subscriber);
    kernel
      .get<EventListener>(MessagingCore.name, EventClientEnum.TSK_BUS_LISTENER)
      .initialize(this.tskMessageBus?.getListener() as Listener);
    kernel
      .get<EventPublisher>(MessagingCore.name, EventClientEnum.TSK_BUS_PUBLISHER)
      .initialize(this.tskMessageBus?.getPublisher() as Publisher);
  }

  private initializeQueueSockets(): void {
    kernel
      .get<EventQueue>(MessagingCore.name, QueueClientEnum.TSK_QUEUE_PUBLISHER)
      .initialize(this.tskMessageQueue?.getQueuePublisher() as Publisher);
  }

  private initListeners(): void {
    kernel.get<EventListener>(MessagingCore.name, EventClientEnum.TSK_BUS_LISTENER).listen();

    kernel.get<QueueListener>(MessagingCore.name, QueueListener.name).listen();
  }

  initialize(): void {
    this.setSubscriptions();
    this.initializeBusSockets();
    this.initializeQueueSockets();
    this.initListeners();
  }

  close(): void {
    this.tskMessageBus?.disconnect();
    this.tskMessageQueue?.disconnect();
  }
}
