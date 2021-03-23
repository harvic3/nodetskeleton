import { Resources } from "resources-tsk";
import * as esLocal from "./es.local.json";
import * as enLocal from "./en.local.json";

import * as localKeys from "./keys.json";

const locals = {
  es: esLocal,
  en: enLocal,
};

const resourceKeys = localKeys;

const resources = new Resources(locals, localKeys);

export { resourceKeys, Resources };

export default resources;
