import { LocaleTypeEnum } from "../../application/shared/locals/LocaleType.enum";
import { ServiceContext } from "../../adapters/shared/ServiceContext";
import { BooleanUtil } from "../../domain/shared/utils/BooleanUtil";
import { Normalize } from "./Normalize";
import "dotenv/config";

const dev = "development";

if (!process.env?.NODE_ENV || BooleanUtil.areEqual(process.env.NODE_ENV, dev)) {
  console.log("Running in dev mode");
}

const serviceContext = process.env.SERVICE_CONTEXT || ServiceContext.NODE_TS_SKELETON;

export default {
  Environment: process.env.NODE_ENV || dev,
  Controllers: {
    ContextPaths: [
      Normalize.pathFromOS(
        Normalize.absolutePath(__dirname, "../../adapters/controllers/health/*.controller.??"),
      ),
      Normalize.pathFromOS(
        Normalize.absolutePath(
          __dirname,
          `../../adapters/controllers/${serviceContext}/*.controller.??`,
        ),
      ),
    ],
    DefaultPath: [
      Normalize.pathFromOS(
        Normalize.absolutePath(__dirname, "../../adapters/controllers/**/*.controller.??"),
      ),
    ],
    Ignore: [Normalize.pathFromOS("**/base")],
  },
  Server: {
    Root: process.env.SERVER_ROOT || "/api",
    Host: process.env.SERVER_HOST || "localhost",
    Port: process.env.SERVER_PORT || 3003,
    Origins:
      process.env.ORIGINS || "http://localhost:3000,http://localhost:3001,http://localhost:3002",
    ServiceName: process.env.SERVICE_NAME || "NodeTskeleton",
    ServiceContext: {
      LoadWithContext: !!process.env.SERVICE_CONTEXT,
      Context: serviceContext,
    },
  },
  Services: {
    MessageBus: {
      Host: process.env.MESSAGE_BUS_CONNECTION_HOST || "localhost",
      Port: Number(process.env.MESSAGE_BUS_CONNECTION_PORT) || 6379,
      DbIndex: Number(process.env.MESSAGE_BUS_DB_INDEX) || 0,
    },
    MessageQueue: {
      Host: process.env.MESSAGE_QUEUE_CONNECTION_HOST || "localhost",
      Port: Number(process.env.MESSAGE_QUEUE_CONNECTION_PORT) || 6379,
      DbIndex: Number(process.env.MESSAGE_QUEUE_DB_INDEX) || 1,
    },
    AuthCache: {
      Host: process.env.AUTH_CACHE_CONNECTION_HOST || "localhost",
      Port: Number(process.env.AUTH_CACHE_CONNECTION_PORT) || 6379,
      DbIndex: Number(process.env.AUTH_CACHE_DB_INDEX) || 2,
    },
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
