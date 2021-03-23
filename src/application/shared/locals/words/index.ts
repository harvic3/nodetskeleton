import { Resources } from "resources-tsk";
import * as esLocal from "./es.local.json";
import * as enLocal from "./en.local.json";

import * as localKeys from "./keys.json";

const locals = {
  es: esLocal,
  en: enLocal,
};

const wordKeys = localKeys;

const words = new Resources(locals, localKeys);

export { wordKeys, Resources };

export default words;
