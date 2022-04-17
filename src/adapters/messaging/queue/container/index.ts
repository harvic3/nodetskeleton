import { ContainerDictionary } from "../../../shared/dic/ContainerDictionary";
import messageQueueHandler from "../../handlers/queue/MessageQueue.handler";
import { ServiceContainer } from "../../../shared/dic/ServiceContainer";
import { QueueListener } from "../listener/QueueListener";
import { QueueClientEnum } from "../QueueClient.enum";
import { EventQueue } from "../publisher/EventQueue";
import { EventEmitter } from "events";

const tskQueueEventEmitter = new EventEmitter();

const tskQueuePublisher = new EventQueue(QueueClientEnum.TSK_QUEUE);

const dictionary = new ContainerDictionary();
dictionary.addSingleton(QueueClientEnum.TSK_QUEUE_PUBLISHER, tskQueuePublisher);
dictionary.addSingleton(
  QueueListener.name,
  new QueueListener(
    QueueClientEnum.TSK_QUEUE_LISTENER_EMITTER,
    messageQueueHandler,
    tskQueueEventEmitter,
    tskQueuePublisher,
  ),
);

export { QueueClientEnum, EventQueue, tskQueueEventEmitter };
export default new ServiceContainer(dictionary);
