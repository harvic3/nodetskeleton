import infraContainer from "../container";
infraContainer.load();
import healthController from "../../adapters/controllers/health/Health.controller";
import routeWhiteListMiddleware from "../middleware/authorization/whiteList";
import AppSettings from "../../application/shared/settings/AppSettings";
import Encryption from "../../application/shared/security/encryption";
import authorizationMiddleware from "../middleware/authorization/jwt";
import { BooleanUtil } from "../../domain/shared/utils/BooleanUtil";
import { TypeParser } from "../../domain/shared/utils/TypeParser";
import { Router, Server, bodyParser, cors } from "./core/Modules";
import resources from "../../application/shared/locals/messages";
import localizationMiddleware from "../middleware/localization";
import useCaseTraceMiddleware from "../middleware/trace/index";
import ArrayUtil from "../../domain/shared/utils/ArrayUtil";
import words from "../../application/shared/locals/words";
import errorHandlerMiddleware from "../middleware/error";
import corsMiddleware from "../middleware/cors";
import { resolve as resolvePath } from "path";
import { sync } from "fast-glob";
import config from "../config";
import BaseController, {
  IRouterType,
  ServiceContext,
} from "../../adapters/controllers/base/Base.controller";

export default class AppWrapper {
  private readonly controllersLoadedByConstructor = BooleanUtil.NO;
  app: Server;

  constructor(controllers?: BaseController[]) {
    this.setup();
    this.app = new Server({ proxy: BooleanUtil.YES });
    this.loadMiddleware();
    console.log(
      `Initializing controllers for ${AppSettings.ServiceContext.toUpperCase()} ServiceContext`,
    );
    if (ArrayUtil.any(controllers)) {
      this.loadControllersByConstructor(controllers as BaseController[]);
      this.controllersLoadedByConstructor = BooleanUtil.YES;
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
        controller.initializeRoutes(TypeParser.cast<IRouterType>(new Router()));
        controller.router?.prefix(config.Server.Root);
        this.app
          .use(TypeParser.cast<Router.IMiddleware<any, {}>>(controller.router?.routes()))
          .use(TypeParser.cast<Router.IMiddleware<any, {}>>(controller.router?.allowedMethods()));
        console.log(`${controller?.constructor?.name} was initialized`);
      });
    // this.app.use(TypeParser.cast<Router.IMiddleware<any, {}>>(healthController.resourceNotFound));
    this.loadErrorHandler();
  }

  private async loadControllersDynamically(): Promise<void> {
    if (this.controllersLoadedByConstructor) return Promise.resolve();

    const controllerPaths = config.Server.ServiceContext.LoadWithContext
      ? config.Controllers.ContextPaths.map((serviceContext) => {
          return sync(serviceContext, {
            onlyFiles: BooleanUtil.YES,
            ignore: config.Controllers.Ignore,
          });
        }).flat()
      : sync(config.Controllers.DefaultPath, {
          onlyFiles: BooleanUtil.YES,
          ignore: config.Controllers.Ignore,
        });
    for (const filePath of controllerPaths) {
      const controllerPath = resolvePath(filePath);
      const { default: controller } = await import(controllerPath);
      controller.initializeRoutes(TypeParser.cast<IRouterType>(new Router()));
      controller.router?.prefix(config.Server.Root);
      this.app
        .use(TypeParser.cast<Router.IMiddleware<any, {}>>(controller.router?.routes()))
        .use(TypeParser.cast<Router.IMiddleware<any, {}>>(controller.router?.allowedMethods()));
      console.log(`${controller?.constructor?.name} was loaded`);
    }
    // this.app.use(TypeParser.cast<Router.IMiddleware<any, {}>>(healthController.resourceNotFound));
    this.loadErrorHandler();

    return Promise.resolve();
  }

  private loadMiddleware(): void {
    this.app
      .use(cors(corsMiddleware.handle))
      .use(bodyParser())
      .use(localizationMiddleware.handle)
      .use(routeWhiteListMiddleware.handle)
      .use(authorizationMiddleware.handle.bind(this))
      .use(useCaseTraceMiddleware.handle);
  }

  private loadErrorHandler(): void {
    this.app.on("error", errorHandlerMiddleware.handle.bind(this));
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
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}
