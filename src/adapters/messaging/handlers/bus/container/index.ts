import { Container, IContainerDictionary } from "../../../../../infrastructure/ioc/Container";
import { QueueClientEnum } from "../../../queue/QueueClient.enum";
import { tskQueueEventEmitter } from "../../../queue/container";

// TODO: register message bus use case here
const dictionary: IContainerDictionary = {};
dictionary[QueueClientEnum.TSK_QUEUE_LISTENER_EMITTER] = () => tskQueueEventEmitter;

export default new Container(dictionary);
