import Encryptor from "../../application/shared/security/encryption/Encryptor";
import BaseController from "../../adapters/controllers/base/BaseController";
import AppSettings from "../../application/shared/settings/AppSettings";
import authorizationMiddleware from "../middleware/authorization/jwt";
import { ServerApp, Application, BodyParser } from "./core/Modules";
import resources from "../../application/shared/locals/messages";
import localizationMiddleware from "../middleware/localization";
import words from "../../application/shared/locals/words";
import errorHandlerMiddleware from "../middleware/error";
import * as helmet from "helmet";
import config from "../config";

export default class AppWrapper {
  app: Application;

  constructor(controllers: BaseController[]) {
    this.setup();
    this.app = ServerApp();
    this.app.set("trust proxy", true);
    this.loadMiddleware();
    this.loadControllers(controllers);
    this.loadErrorHandler();
  }

  private loadMiddleware(): void {
    this.app.use(helmet());
    this.app.use(BodyParser());
    this.app.use(localizationMiddleware.handle);
    this.app.use(authorizationMiddleware.handle);
  }

  private loadControllers(controllers: BaseController[]): void {
    controllers.forEach((controller) => {
      this.app.use(AppSettings.ServerRoot, controller.router);
    });
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
      // Initialize db and other services here and once started run server start
      // reject if any error with db or other service
      resolve();
    });
  }
}
