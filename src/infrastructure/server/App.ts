import { Server, Application, BodyParser } from "../server/CoreModules";
import BaseController from "../../adapters/controllers/base/BaseController";
import LocalizationMiddleware from "../middleware/localization";
import handlerErrorMiddleware from "../middleware/handleError";
import resources from "../../application/shared/locals/index";
import * as helmet from "helmet";
import config from "../config";

export default class App {
  public app: Application;

  constructor(controllers: BaseController[]) {
    this.app = Server();
    this.app.set("trust proxy", true);
    this.loadMiddleware();
    this.loadControllers(controllers);
    this.loadHandleError();
    this.setup();
  }

  public loadMiddleware(): void {
    this.app.use(helmet());
    this.app.use(BodyParser());
    this.app.use(LocalizationMiddleware.handler);
  }

  private loadControllers(controllers: BaseController[]): void {
    controllers.forEach((controller) => {
      this.app.use(config.server.Root, controller.router);
    });
  }

  private loadHandleError(): void {
    this.app.use(handlerErrorMiddleware.handler);
  }

  private setup(): void {
    resources.setDefaultLanguage(config.params.DefaultLang);
  }

  public listen(): void {
    this.app.listen(config.server.Port, () => {
      console.log(
        `Server running on ${config.server.Host}:${config.server.Port}${config.server.Root}`,
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
