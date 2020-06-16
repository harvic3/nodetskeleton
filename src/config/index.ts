import "dotenv";
import ServerModules from "./serverModules";
// export { Context } from "./serverModules"; //For Koa
export { Request, Response } from "./serverModules"; // For expressjs

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
  },
};
