import * as dotenv from "dotenv";
dotenv.config();

const dev = "development";

export default {
  env: process.env.NODE_ENV || dev,
  server: {
    root: process.env.SERVER_ROOT || "/api",
    host: process.env.SERVER_HOST || "localhost",
    port: process.env.SERVER_PORT || 5030,
    origins: process.env.ORIGINS || "http://localhost:4501",
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
