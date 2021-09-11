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

const wordKeys = localKeys;

const words = new Resources(locals, localKeys, LocaleTypeEnum.EN);

export { wordKeys, Resources };

export default words;
