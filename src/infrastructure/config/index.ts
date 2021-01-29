import * as dotenv from "dotenv";

if (!process?.env?.NODE_ENV) {
  dotenv.config();
}

const dev = "development";

export default {
  Environment: process.env.NODE_ENV || dev,
  server: {
    Root: process.env.SERVER_ROOT || "/api",
    Host: process.env.SERVER_HOST || "localhost",
    Port: process.env.SERVER_PORT || 3003,
    Origins:
      process.env.ORIGINS || "http://localhost:3000,http://localhost:3001,http://localhost:3002",
  },
  params: {
    envs: {
      Dev: dev,
      Test: "testing",
      Release: "release",
      Production: "production",
    },
    defaultApplicationError: {
      code: "500",
      message: "SOMETHING_WENT_WRONG",
    },
    defaultLang: "en",
  },
};
