import { ServerApp, Application, bodyParser, urlencoded } from "./core/Modules";
import Encryptor from "../../application/shared/security/encryption/Encryptor";
import BaseController from "../../adapters/controllers/base/Base.controller";
import AppSettings from "../../application/shared/settings/AppSettings";
import authorizationMiddleware from "../middleware/authorization/jwt";
import resources from "../../application/shared/locals/messages";
import localizationMiddleware from "../middleware/localization";
import words from "../../application/shared/locals/words";
import errorHandlerMiddleware from "../middleware/error";
import { sync } from "fast-glob";
import * as helmet from "helmet";
import { resolve } from "path";
import config from "../config";

export default class AppWrapper {
  private readonly constructorControllersLoaded: boolean = false;
  app: Application;

  constructor(controllers?: BaseController[]) {
    this.setup();
    this.app = ServerApp();
    this.app.set("trust proxy", true);
    this.loadMiddleware();
    if (controllers?.length) {
      this.loadControllersByConstructor(controllers);
      this.constructorControllersLoaded = true;
    }
  }

  private loadControllersByConstructor(controllers: BaseController[]): void {
    controllers.forEach((controller) => {
      this.app.use(AppSettings.ServerRoot, controller.router);
    });
    this.loadErrorHandler();
  }

  private async loadControllersDynamically(): Promise<void> {
    if (this.constructorControllersLoaded) return Promise.resolve();

    const controllerPaths = sync(config.Controllers.Path, {
      onlyFiles: true,
      ignore: config.Controllers.Ignore,
    });
    for (const filePath of controllerPaths) {
      const controllerPath = resolve(filePath);
      const { default: controller } = await import(controllerPath);
      console.log(`${controller?.constructor?.name} was loaded`);
      this.app.use(AppSettings.ServerRoot, (controller as BaseController)?.router);
    }
    this.loadErrorHandler();

    return Promise.resolve();
  }

  private loadMiddleware(): void {
    this.app.use(helmet());
    this.app.use(bodyParser());
    this.app.use(urlencoded({ extended: true }));
    this.app.use(localizationMiddleware.handle);
    this.app.use(authorizationMiddleware.handle);
  }

  private loadErrorHandler(): void {
    this.app.use(errorHandlerMiddleware.handle);
  }

  private setup(): void {
    AppSettings.init(config);
    resources.setDefaultLanguage(AppSettings.DefaultLang);
    words.setDefaultLanguage(AppSettings.DefaultLang);
    Encryptor.init(AppSettings.EncryptionKey);
  }

  initializeServices(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.loadControllersDynamically().then(() => {
          // Initialize database service and other services here
          // reject if any error with database or other service
          resolve();
        });
      } catch (error) {
        reject(error);
      }
    });
  }
}
