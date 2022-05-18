import { EventQueue, QueueClientEnum } from "../../../adapters/messaging/queue/container";
import { ChannelNameEnum } from "../../../application/shared/messaging/ChannelName.enum";
import { Listener, MessageBus, Publisher, Subscriber } from "../../messaging/MessageBus";
import { QueueListener } from "../../../adapters/messaging/queue/listener/QueueListener";
import AppSettings from "../../../application/shared/settings/AppSettings";
import { TypeParser } from "../../../domain/shared/utils/TypeParser";
import { ClientModeEnum } from "../../messaging/ClientMode.enum";
import ArrayUtil from "../../../domain/shared/utils/ArrayUtil";
import { MessageQueue } from "../../messaging/MessageQueue";
import kernel from "../../../adapters/shared/kernel";
import {
  EventClientEnum,
  EventPublisher,
  EventSubscriber,
  EventListener,
} from "../../../adapters/messaging/bus/container";

export class MessagingClient {
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
    const channelsToSuscribe: ChannelNameEnum[] =
      Object.values(ChannelNameEnum).filter((value) =>
        value.includes(AppSettings.ServiceContext),
      ) || ArrayUtil.EMPTY_ARRAY;
    if (!channelsToSuscribe.length) {
      channelsToSuscribe.push(ChannelNameEnum.QUEUE_USERS);
      channelsToSuscribe.push(ChannelNameEnum.QUEUE_SECURITY);
    }

    for (const channel of channelsToSuscribe) {
      kernel
        .get<EventSubscriber>(MessagingClient.name, EventClientEnum.TSK_BUS_SUBSCRIBER)
        .subscribe(channel);
    }
  }

  private initializeBusSockets(): void {
    kernel
      .get<EventSubscriber>(MessagingClient.name, EventClientEnum.TSK_BUS_SUBSCRIBER)
      .initialize(TypeParser.cast<Subscriber>(this.tskMessageBus?.getSubscriber()));
    kernel
      .get<EventListener>(MessagingClient.name, EventClientEnum.TSK_BUS_LISTENER)
      .initialize(TypeParser.cast<Listener>(this.tskMessageBus?.getListener()));
    kernel
      .get<EventPublisher>(MessagingClient.name, EventClientEnum.TSK_BUS_PUBLISHER)
      .initialize(TypeParser.cast<Publisher>(this.tskMessageBus?.getPublisher()));
  }

  private initializeQueueSockets(): void {
    kernel
      .get<EventQueue>(MessagingClient.name, QueueClientEnum.TSK_QUEUE_PUBLISHER)
      .initialize(TypeParser.cast<Publisher>(this.tskMessageQueue?.getQueuePublisher()));
  }

  private initListeners(): void {
    kernel.get<EventListener>(MessagingClient.name, EventClientEnum.TSK_BUS_LISTENER).listen();

    kernel.get<QueueListener>(MessagingClient.name, QueueListener.name).listen();
  }

  initialize(): void {
    this.setSubscriptions();
    this.initializeBusSockets();
    this.initializeQueueSockets();
    this.initListeners();
  }

  close(): void {
    this.tskMessageBus?.close();
    this.tskMessageQueue?.close();
  }
}
