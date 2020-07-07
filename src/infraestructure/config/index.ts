import "dotenv";
import ServerModules from "../server/CoreModules";
// export { Context, Next } from "../server/CoreModules"; //For Koa
export { Request, Response, NextFunction, Application } from "../server/CoreModules"; // For expressjs

import * as esLocal from "../locals/es.local.json";
import * as enLocal from "../locals/en.local.json";
import * as localKeys from "../locals/keys.json";

const dev = "development";

export default {
  env: process.env.ENVIRONMENT || dev,
  coreModules: {
    Server: ServerModules.Server,
    Router: ServerModules.Router,
    BodyParser: ServerModules.BodyParser,
  },
  server: {
    root: process.env.SERVER_ROOT || "/api",
    host: process.env.SERVER_HOST || "localhost",
    port: process.env.SERVER_PORT || 5030,
  },
  params: {
    envs: {
      dev,
      pdn: "production",
      test: "testing",
    },
    defaultError: {
      code: 500,
      message: "Oh sorry, something went wrong!",
    },
  },
  locals: {
    keys: localKeys,
    langs: {
      es: esLocal,
      en: enLocal,
    },
  },
};
