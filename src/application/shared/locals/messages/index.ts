import AppSettings from "../../settings/AppSettings";
import { LocaleTypeEnum } from "../LocaleType.enum";
import { Resources, IResources } from "../../types";
import { MessageKeysDictionaryEnum } from "./keys";
import ptBrLocal from "./pt-br.local";
import esLocal from "./es.local";
import enLocal from "./en.local";

type LocalesType = {
  [K in LocaleTypeEnum]: { [key in keyof typeof MessageKeysDictionaryEnum]: string };
};

const locales: LocalesType = {
  [LocaleTypeEnum.ES]: esLocal,
  [LocaleTypeEnum.EN]: enLocal,
  [LocaleTypeEnum.ES_CO]: esLocal,
  [LocaleTypeEnum.EN_US]: enLocal,
  [LocaleTypeEnum.PT_BR]: ptBrLocal,
};

export { IResources as Resources };
export default new Resources(locales, MessageKeysDictionaryEnum, AppSettings.DefaultLanguage);
