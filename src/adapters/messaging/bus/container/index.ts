import { EventSubscriber } from "../subscriber/EventSubscriber";
import { EventPublisher } from "../publisher/EventPublisher";
import { EventListener } from "../listener/EventListener";
import { EventClientEnum } from "../EventClient.enum";
import kernel from "../../../shared/kernel";

kernel.addSingleton(
  EventClientEnum.TSK_BUS_LISTENER,
  new EventListener(EventClientEnum.TSK_MESSAGE_BUS),
);
kernel.addSingleton(
  EventClientEnum.TSK_BUS_PUBLISHER,
  new EventPublisher(EventClientEnum.TSK_MESSAGE_BUS),
);
kernel.addSingleton(
  EventClientEnum.TSK_BUS_SUBSCRIBER,
  new EventSubscriber(EventClientEnum.TSK_MESSAGE_BUS),
);

export { EventClientEnum, EventListener, EventPublisher, EventSubscriber };
export default kernel;
