import AppSettings from "../../settings/AppSettings";
import { LocaleTypeEnum } from "../LocaleType.enum";
import { WordKeysDictionaryEnum } from "./keys";
import { Resources } from "../../types";
import ptBrLocal from "./pt-br.local";
import esLocal from "./es.local";
import enLocal from "./en.local";

type LocalesType = {
  [K in LocaleTypeEnum]: { [key in keyof typeof WordKeysDictionaryEnum]: string };
};

const locales: LocalesType = {
  [LocaleTypeEnum.ES]: esLocal,
  [LocaleTypeEnum.EN]: enLocal,
  [LocaleTypeEnum.ES_CO]: esLocal,
  [LocaleTypeEnum.EN_US]: enLocal,
  [LocaleTypeEnum.PT_BR]: ptBrLocal,
};

export default new Resources(locales, WordKeysDictionaryEnum, AppSettings.DefaultLanguage);
