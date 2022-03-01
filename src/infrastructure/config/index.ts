import { LocaleTypeEnum } from "../../application/shared/locals/LocaleType.enum";
import { ServiceContext } from "../app/server/ServiceContext";
import { Normalize } from "./Normalize";
import "dotenv/config";

const dev = "development";

if (!process.env?.NODE_ENV || process.env.NODE_ENV === dev) {
  console.log("Running in dev mode");
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
    ServiceName: process.env.SERVICE_NAME || "NodeTskeleton",
    ServiceContext: process.env.SERVICE_CONTEXT || ServiceContext.NODE_TS_SKELETON,
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
      CRYPTO: {
        EncryptionKey: process.env.ENCRYPTION_KEY,
        EncryptionIterations: Number(process.env.ENCRYPTION_ITERATIONS) || 5e4,
        EncryptionKeySize: Number(process.env.ENCRYPTION_KEY_SIZE) || 128,
      },
    },
    DefaultLang: LocaleTypeEnum.EN,
  },
};
