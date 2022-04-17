import { ContainerDictionary } from "../../../../shared/dic/ContainerDictionary";
import { ServiceContainer } from "../../../../shared/dic/ServiceContainer";
import { QueueClientEnum } from "../../../queue/QueueClient.enum";
import { tskQueueEventEmitter } from "../../../queue/container";

// TODO: register message bus use case here
const dictionary = new ContainerDictionary();
dictionary.addSingleton(QueueClientEnum.TSK_QUEUE_LISTENER_EMITTER, tskQueueEventEmitter);

export default new ServiceContainer(dictionary);
