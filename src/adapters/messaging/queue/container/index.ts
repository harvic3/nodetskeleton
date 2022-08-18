import messageQueueHandler from "../../handlers/queue/MessageQueue.handler";
import { QueueListener } from "../listener/QueueListener";
import { QueueClientEnum } from "../QueueClient.enum";
import { EventQueue } from "../publisher/EventQueue";
import kernel from "../../../shared/kernel";
import { EventEmitter } from "events";

const tskQueueEventEmitter = new EventEmitter();

const tskQueuePublisher = new EventQueue(QueueClientEnum.TSK_QUEUE);

kernel.addSingleton(QueueClientEnum.TSK_QUEUE_PUBLISHER, tskQueuePublisher);
kernel.addSingleton(
  QueueListener.name,
  new QueueListener(
    QueueClientEnum.TSK_QUEUE_LISTENER_EMITTER,
    messageQueueHandler,
    tskQueueEventEmitter,
    tskQueuePublisher,
  ),
);

export { QueueClientEnum, EventQueue, tskQueueEventEmitter };
export default kernel;
