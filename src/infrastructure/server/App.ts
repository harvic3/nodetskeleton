import Encryptor from "../../application/shared/security/encryption/Encryptor";
import BaseController from "../../adapters/controllers/base/BaseController";
import AppSettings from "../../application/shared/settings/AppSettings";
import authorizationMiddleware from "../middleware/authorization/jwt";
import { Server, Application, BodyParser } from "./core/Modules";
import resources from "../../application/shared/locals/messages";
import localizationMiddleware from "../middleware/localization";
import handlerErrorMiddleware from "../middleware/handleError";
import words from "../../application/shared/locals/words";
import * as helmet from "helmet";
import config from "../config";

export default class App {
  public app: Application;

  constructor(controllers: BaseController[]) {
    this.setup();
    this.app = Server();
    this.app.set("trust proxy", true);
    this.loadMiddleware();
    this.loadControllers(controllers);
    this.loadHandleError();
  }

  public loadMiddleware(): void {
    this.app.use(helmet());
    this.app.use(BodyParser());
    this.app.use(localizationMiddleware.handler);
    this.app.use(authorizationMiddleware.handler);
  }

  private loadControllers(controllers: BaseController[]): void {
    controllers.forEach((controller) => {
      this.app.use(AppSettings.ServerRoot, controller.router);
    });
  }

  private loadHandleError(): void {
    this.app.use(handlerErrorMiddleware.handler);
  }

  private setup(): void {
    AppSettings.init(config);
    resources.setDefaultLanguage(AppSettings.DefaultLang);
    words.setDefaultLanguage(AppSettings.DefaultLang);
    Encryptor.init(AppSettings.EncryptionKey);
  }

  public listen(): void {
    this.app.listen(config.server.Port, () => {
      console.log(
        `Server running on ${AppSettings.ServerHost}:${AppSettings.ServerPort}${AppSettings.ServerRoot}`,
      );
    });
  }

  private runServices(): void {
    // Initialize db and other services here and once started run Listen
    this.listen();
  }

  public start(): void {
    this.runServices();
  }
}
