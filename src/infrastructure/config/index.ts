import { MessageKeysDictionaryEnum } from "../../application/shared/locals/messages/keys";
import { LocaleTypeEnum } from "../../application/shared/locals/LocaleType.enum";
import { ServiceContext } from "../../adapters/shared/ServiceContext";
import { DefaultValue } from "../../domain/shared/utils/DefaultValue";
import { BooleanUtil } from "../../domain/shared/utils/BooleanUtil";
import { Normalize } from "./Normalize";

const DEV = "development";

if (!process.env?.NODE_ENV || BooleanUtil.areEqual(process.env.NODE_ENV, DEV))
  console.log("Running in dev mode");

const serviceContext = DefaultValue.evaluateAndGet(
  process.env.SERVICE_CONTEXT,
  ServiceContext.NODE_TS_SKELETON,
);

export default {
  Environment: DefaultValue.evaluateAndGet(process.env.NODE_ENV, DEV),
  Controllers: {
    ContextPaths: [
      Normalize.pathFromOS(
        Normalize.absolutePath(__dirname, "../../adapters/controllers/status/*.controller.??"),
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
    Root: DefaultValue.evaluateAndGet(process.env.SERVER_ROOT, "/api"),
    Host: DefaultValue.evaluateAndGet(process.env.SERVER_HOST, "localhost"),
    Port: DefaultValue.evaluateAndGet(Number(process.env.SERVER_PORT), 3003, [0]),
    Origins: DefaultValue.evaluateAndGet(
      process.env.ORIGINS,
      "http://localhost:3000,http://localhost:3001,http://localhost:3002",
    ),
    ServiceName: DefaultValue.evaluateAndGet(process.env.SERVICE_NAME, "NodeTSkeleton"),
    ServiceContext: {
      LoadWithContext: !!process.env.SERVICE_CONTEXT,
      Context: serviceContext,
    },
  },
  Params: {
    Envs: {
      Dev: DEV,
      Test: "testing",
      Release: "release",
      Production: "production",
    },
    DefaultApplicationError: {
      Code: "500",
      MessageKey: MessageKeysDictionaryEnum.SOMETHING_WENT_WRONG,
    },
    Security: {
      JWT: {
        SecretKey: process.env.JWT_SECRET_KEY,
        ExpireInSeconds: DefaultValue.evaluateAndGet(
          Number(process.env.JWT_EXPIRE_IN_SECONDS),
          3600,
        ),
      },
      CRYPTO: {
        EncryptionKey: process.env.ENCRYPTION_KEY,
        EncryptionIterations: DefaultValue.evaluateAndGet(
          Number(process.env.ENCRYPTION_ITERATIONS),
          5e4,
        ),
        EncryptionKeySize: DefaultValue.evaluateAndGet(
          Number(process.env.ENCRYPTION_KEY_SIZE),
          128,
        ),
      },
    },
    DefaultLanguage: LocaleTypeEnum.EN,
    DefaultHealthRemoteService: DefaultValue.evaluateAndGet(
      process.env.REMOTE_HEALTH_SERVICE,
      "https://google.com",
    ),
    ApiDocsInfo: {
      title: "NodeTSkeleton API",
      version: "1.0.0",
      description: "Api documentation for NodeTSkeleton project",
      contact: {
        name: "TSK Support",
        url: "https://github.com/harvic3/nodetskeleton",
        email: "harvic3@protonmail.com",
      },
      license: {
        name: "BSD 3-Clause",
      },
    },
  },
};
