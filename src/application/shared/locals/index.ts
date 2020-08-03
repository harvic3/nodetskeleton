import * as esLocal from "./es.local.json";
import * as enLocal from "./en.local.json";

import * as localKeys from "./keys.json";
import { Resources } from "./Resources";

const locals = {
  es: esLocal,
  en: enLocal,
};

const defaultLanguage = "en";

const resourceKeys = localKeys;

const resources = new Resources(defaultLanguage, locals, localKeys);

export { resourceKeys, Resources };

export default resources;
