import * as dotenv from "dotenv";
if (!process?.env?.NODE_ENV) {
  dotenv.config();
}

const dev = "development";

export default {
  env: process.env.NODE_ENV || dev,
  server: {
    root: process.env.SERVER_ROOT || "/api",
    host: process.env.SERVER_HOST || "localhost",
    port: process.env.SERVER_PORT || 3003,
    origins:
      process.env.ORIGINS || "http://localhost:3000,http://localhost:3001,http://localhost:3002",
  },
  params: {
    envs: {
      dev,
      pdn: "production",
      test: "testing",
    },
    defaultError: {
      code: 500,
      message: "SOMETHING_WENT_WRONG",
    },
    defaultLang: "en",
  },
};
