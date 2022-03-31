import { Container, IContainerDictionary } from "../../../../infrastructure/ioc/Container";
import messageQueueHandler from "../../handlers/queue/MessageQueue.handler";
import { QueueListener } from "../listener/QueueListener";
import { QueueClientEnum } from "../QueueClient.enum";
import { EventQueue } from "../publisher/EventQueue";
import { EventEmitter } from "events";

const tskQueueEventEmitter = new EventEmitter();

const tskQueuePublisher = new EventQueue(QueueClientEnum.TSK_QUEUE);

const tskQueueListener = new QueueListener(
  QueueClientEnum.TSK_QUEUE_LISTENER_EMITTER,
  messageQueueHandler,
  tskQueueEventEmitter,
  tskQueuePublisher,
);

const dictionary: IContainerDictionary = {};
dictionary[QueueClientEnum.TSK_QUEUE_PUBLISHER] = (): EventQueue => tskQueuePublisher;
dictionary[QueueListener.name] = () => tskQueueListener;

export { QueueClientEnum, EventQueue, tskQueueEventEmitter };
export default new Container(dictionary);
