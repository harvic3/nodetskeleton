import { Normalize } from "./Normalize";
import * as dotenv from "dotenv";

const dev = "development";

if (!process?.env?.NODE_ENV) {
  console.log("Running in dev mode");
  dotenv.config();
}

export default {
  Environment: process.env.NODE_ENV || dev,
  Controllers: {
    Path: Normalize.pathToSO(
      Normalize.absolutePath(__dirname, "../../adapters/controllers/**/*.controller.??"),
    ),
    Ignore: [Normalize.pathToSO("**/base")],
  },
  Server: {
    Root: process.env.SERVER_ROOT || "/api",
    Host: process.env.SERVER_HOST || "localhost",
    Port: process.env.SERVER_PORT || 3003,
    Origins:
      process.env.ORIGINS || "http://localhost:3000,http://localhost:3001,http://localhost:3002",
  },
  Params: {
    Envs: {
      Dev: dev,
      Test: "testing",
      Release: "release",
      Production: "production",
    },
    DefaultApplicationError: {
      Code: "500",
      Message: "SOMETHING_WENT_WRONG",
    },
    Security: {
      JWT: {
        SecretKey: process.env.JWT_SECRET_KEY,
        ExpireInSeconds: 3600,
      },
      EncryptionKey: process.env.ENCRYPTION_KEY,
    },
    DefaultLang: "en",
  },
};
