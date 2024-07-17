import infraContainer from "../container";
infraContainer.load();
import { ApiDocGenerator } from "./docs/ApiDocGenerator";
import statusController from "../../adapters/controllers/status/Status.controller";
import routeWhiteListMiddleware from "../middleware/authorization/whiteList";
import AppSettings from "../../application/shared/settings/AppSettings";
import Encryption from "../../application/shared/security/encryption";
import authorizationMiddleware from "../middleware/authorization/jwt";
import sessionMiddleware from "../middleware/authorization/session";
import { BooleanUtil } from "../../domain/shared/utils/BooleanUtil";
import { TypeParser } from "../../domain/shared/utils/TypeParser";
import resources from "../../application/shared/locals/messages";
import localizationMiddleware from "../middleware/localization";
import useCaseTraceMiddleware from "../middleware/trace/index";
import clientInfoMiddleware from "../middleware/clientInfo";
import ArrayUtil from "../../domain/shared/utils/ArrayUtil";
import words from "../../application/shared/locals/words";
import errorHandlerMiddleware from "../middleware/error";
import BaseController, {
  IRouter,
  ServiceContext,
} from "../../adapters/controllers/base/Base.controller";
import { serve, setup } from "swagger-ui-express";
import { resolve as resolvePath } from "path";
import { sync } from "fast-glob";
import config from "../config";
import helmet from "helmet";
import {
  Router,
  Express,
  AppServer,
  bodyParser,
  urlencoded,
  Application,
  RequestHandler,
} from "./core/Modules";
import * as cors from "cors";

export default class AppWrapper {
  #controllersLoadedByConstructor = false;
  app: Express;
  apiDocGenerator: ApiDocGenerator;

  constructor(controllers?: BaseController[]) {
    this.setup();
    this.app = AppServer();
    this.apiDocGenerator = new ApiDocGenerator(AppSettings.Environment, config.Params.ApiDocsInfo);
    this.app.set("trust proxy", true);
    this.loadMiddleware();
    console.log(
      `Initializing controllers for ${AppSettings.ServiceContext.toUpperCase()} ServiceContext`,
    );
    if (ArrayUtil.any(controllers)) {
      this.loadControllersByConstructor(controllers as BaseController[]);
      this.#controllersLoadedByConstructor = true;
    }
  }

  private loadControllersByConstructor(controllers: BaseController[]): void {
    controllers
      .filter(
        (controller: BaseController) =>
          BooleanUtil.areEqual(controller.serviceContext, AppSettings.ServiceContext) ||
          BooleanUtil.areEqual(controller.serviceContext, ServiceContext.NODE_TS_SKELETON),
      )
      .forEach((controller) => {
        controller.setApiDocGenerator(this.apiDocGenerator);
        controller.initializeRoutes(TypeParser.cast<IRouter>(Router));
        this.app.use(AppSettings.ServerRoot, TypeParser.cast<Application>(controller.router));
        console.log(`${controller?.constructor?.name} was initialized`);
      });
    this.loadLastHandlers();
  }

  private async loadControllersDynamically(): Promise<void> {
    if (this.#controllersLoadedByConstructor) return Promise.resolve();

    const controllerPaths = config.Server.ServiceContext.LoadWithContext
      ? config.Controllers.ContextPaths.map((serviceContext) => {
          return sync(serviceContext, {
            onlyFiles: true,
            ignore: config.Controllers.Ignore,
          });
        }).flat()
      : sync(config.Controllers.DefaultPath, {
          onlyFiles: true,
          ignore: config.Controllers.Ignore,
        });

    for (const filePath of controllerPaths) {
      const controllerPath = resolvePath(filePath);
      const { default: controller } = await import(controllerPath);
      controller.setApiDocGenerator(this.apiDocGenerator);
      controller.initializeRoutes(TypeParser.cast<IRouter>(Router));
      this.app.use(AppSettings.ServerRoot, TypeParser.cast<Application>(controller.router));
      console.log(`${controller?.constructor?.name} was loaded`);
    }
    this.loadLastHandlers();

    return Promise.resolve();
  }

  private loadMiddleware(): void {
    const options: cors.CorsOptions = {
      origin: AppSettings.ServerOrigins.split(","),
    };

    this.app
      .use(cors(options))
      .use(helmet())
      .use(bodyParser())
      .use(urlencoded({ extended: true }))
      .use(clientInfoMiddleware.handle)
      .use(localizationMiddleware.handle)
      .use(routeWhiteListMiddleware.handle)
      .use(authorizationMiddleware.handle)
      .use(sessionMiddleware.handle)
      .use(useCaseTraceMiddleware.handle);
  }

  private setup(): void {
    AppSettings.init(config);
    resources.setDefaultLanguage(AppSettings.DefaultLanguage);
    words.setDefaultLanguage(AppSettings.DefaultLanguage);
    Encryption.init(
      AppSettings.EncryptionKey,
      AppSettings.EncryptionIterations,
      AppSettings.EncryptionKeySize,
    );
  }

  initializeServices(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.loadControllersDynamically()
        .then(() => {
          // Initialize database service and other services here. For do it you should add a try catch block.
          // reject if any error with database or other service.
          return resolve();
        })
        .catch((error) => {
          return reject(new Error(error));
        });
    });
  }

  private loadLastHandlers(): void {
    this.app
      .use(`${config.Server.Root}/docs`, serve, setup(this.apiDocGenerator.apiDoc))
      .use(TypeParser.cast<RequestHandler>(statusController.resourceNotFound))
      .use(errorHandlerMiddleware.handle);
  }
}
