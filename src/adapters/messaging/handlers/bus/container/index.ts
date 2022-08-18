import { QueueClientEnum } from "../../../queue/QueueClient.enum";
import { tskQueueEventEmitter } from "../../../queue/container";
import kernel from "../../../../shared/kernel";

// TODO: register message bus use case here
kernel.addSingleton(QueueClientEnum.TSK_QUEUE_LISTENER_EMITTER, tskQueueEventEmitter);

export default kernel;
