import { LocaleTypeEnum } from "../LocaleType.enum";
import { Resources } from "resources-tsk";
import esLocal from "./es.local";
import enLocal from "./en.local";
import localKeys from "./keys";

const locals = {
  [LocaleTypeEnum.ES]: esLocal,
  [LocaleTypeEnum.EN]: enLocal,
  [LocaleTypeEnum.ES_CO]: esLocal,
  [LocaleTypeEnum.EN_US]: enLocal,
};

export { Resources, localKeys, locals };
export default new Resources(locals, localKeys, LocaleTypeEnum.EN);
