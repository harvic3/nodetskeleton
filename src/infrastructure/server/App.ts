// For KoaJs
// import config from "../config";
// import { Server, BodyParser, cors } from "./CoreModules";
// import BaseController from "../../adapters/controllers/BaseController";
// import localization from "../middlewares/localization";
// import handleError from "../middlewares/handleError";

// const bodyParser = BodyParser;

// export default class App {
//   public app: Server;

//   constructor(controllers: BaseController[]) {
//     this.app = new Server();
//     this.LoadMiddlewares();
//     this.LoadControllers(controllers);
//     this.LoadHandleError();
//   }

//   public LoadMiddlewares(): void {
//     // this.app.use(cors());
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

//   public Listen(): void {
//     this.app.listen(config.server.port, () => {
//       console.log(`Server running on ${config.server.host}:${config.server.port}`);
//     });
//   }
// }

// For ExpressJs
import config from "../config";
import { Server, BodyParser, Application } from "./CoreModules";
import BaseController from "../../adapters/controllers/BaseController";
import localization from "../middlewares/localization";
import handleError from "../middlewares/handleError";

export default class App {
  public app: Application;

  constructor(controllers: BaseController[]) {
    this.app = Server();
    this.LoadMiddlewares();
    this.LoadControllers(controllers);
    this.LoadHandleError();
  }

  public LoadMiddlewares(): void {
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

  public Listen(): void {
    this.app.listen(config.server.port, () => {
      console.log(`Server running on ${config.server.host}:${config.server.port}`);
    });
  }
}
