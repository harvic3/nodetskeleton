// For KoaJs
// import BaseController from "../../adapters/controllers/BaseController";
// import resources from "../../application/shared/locals/index";
// import { Server, BodyParser, cors } from "./CoreModules";
// import localization from "../middleware/localization";
// import handleError from "../middleware/handleError";
// import config from "../config";

// const bodyParser = BodyParser;

// export default class App {
//   public app: Server;

//   constructor(controllers: BaseController[]) {
//     this.app = new Server();
//     this.LoadMiddleware();
//     this.LoadControllers(controllers);
//     this.LoadHandleError();
//     this.Settings();
//   }

//   public LoadMiddleware(): void {
//     this.app.use(bodyParser());
//     this.app.use(localization());
//   }

//   private LoadControllers(controllers: BaseController[]) {
//     controllers.forEach((controller) => {
//       controller.router.prefix(config.server.root);
//       this.app.use(controller.router.routes());
//       this.app.use(controller.router.allowedMethods());
//     });
//   }

//   private LoadHandleError(): void {
//     this.app.on("error", handleError());
//   }

//   private Settings(): void {
//     resources.SetDefaultLanguage(config.params.defaultLang);
//   }

//   private Listen(): void {
//     this.app.listen(config.server.port, () => {
//       console.log(
//         `Server running on ${config.server.root}${config.server.host}:${config.server.port}`,
//       );
//     });
//   }

//   private RunServices(): void {
//     // Initialize db and other services here and once started run Listen
//     this.Listen();
//   }

//   public Start(): void {
//     this.RunServices();
//   }
// }

// For ExpressJs
import { Server, BodyParser, Application } from "../server/CoreModules";
import BaseController from "../../adapters/controllers/BaseController";
import resources from "../../application/shared/locals/index";
import localization from "../middleware/localization";
import handleError from "../middleware/handleError";
import config from "../config";

export default class App {
  public app: Application;

  constructor(controllers: BaseController[]) {
    this.app = Server();
    this.LoadMiddleware();
    this.LoadControllers(controllers);
    this.LoadHandleError();
    this.Settings();
  }

  public LoadMiddleware(): void {
    this.app.use(BodyParser.json());
    this.app.use(localization());
  }

  private LoadControllers(controllers: BaseController[]): void {
    controllers.forEach((controller) => {
      this.app.use(config.server.root, controller.router);
    });
  }

  private LoadHandleError(): void {
    this.app.use(handleError());
  }

  private Settings(): void {
    resources.SetDefaultLanguage(config.params.defaultLang);
  }

  public Listen(): void {
    this.app.listen(config.server.port, () => {
      console.log(
        `Server running on ${config.server.root}${config.server.host}:${config.server.port}`,
      );
    });
  }

  private RunServices(): void {
    // Initialize db and other services here and once started run Listen
    this.Listen();
  }

  public Start(): void {
    this.RunServices();
  }
}
