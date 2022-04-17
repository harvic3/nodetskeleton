import { ContainerDictionary } from "../../../shared/dic/ContainerDictionary";
import { ServiceContainer } from "../../../shared/dic/ServiceContainer";
import { EventSubscriber } from "../subscriber/EventSubscriber";
import { EventPublisher } from "../publisher/EventPublisher";
import { EventListener } from "../listener/EventListener";
import { EventClientEnum } from "../EventClient.enum";

const tskMessageListener = new EventListener(EventClientEnum.TSK_MESSAGE_BUS);
const tskMessagePublisher = new EventPublisher(EventClientEnum.TSK_MESSAGE_BUS);
const tskMessageSubscriber = new EventSubscriber(EventClientEnum.TSK_MESSAGE_BUS);

const dictionary = new ContainerDictionary();
dictionary.addScoped(EventClientEnum.TSK_BUS_LISTENER, (): EventListener => tskMessageListener);
dictionary.addScoped(EventClientEnum.TSK_BUS_PUBLISHER, (): EventPublisher => tskMessagePublisher);
dictionary.addScoped(
  EventClientEnum.TSK_BUS_SUBSCRIBER,
  (): EventSubscriber => tskMessageSubscriber,
);

export { EventClientEnum, EventListener, EventPublisher, EventSubscriber };
export default new ServiceContainer(dictionary);
