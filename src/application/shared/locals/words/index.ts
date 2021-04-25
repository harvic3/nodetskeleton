import { Resources } from "resources-tsk";
import esLocal from "./es.local";
import enLocal from "./en.local";

import localKeys from "./keys";

const locals = {
  es: esLocal,
  en: enLocal,
};

const wordKeys = localKeys;

const words = new Resources(locals, localKeys);

export { wordKeys, Resources };

export default words;
