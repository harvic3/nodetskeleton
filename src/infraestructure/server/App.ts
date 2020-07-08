// // For KoaJs
// import config from "../config";
// import Result from "../../application/result/Result";
// import { ApplicationError } from "../error/ApplicationError";
// import localization from "../middlewares/localization";
// import BaseController from "../../application/result/BaseController";

// const bodyParser = config.coreModules.BodyParser;

// export default class App {
//   public app: any;

//   constructor(controllers: BaseController[]) {
//     this.app = new config.coreModules.Server();
//     this.LoadMiddlewares();
//     this.LoadControllers(controllers);
//     this.LoadHandleError();
//   }

//   public LoadMiddlewares(): void {
//     this.app.use(bodyParser());
//     this.app.use(localization());
//   }

//   private LoadControllers(controllers: BaseController[]) {
//     controllers.forEach((controller) => {
//       this.app.use(controller.router.routes());
//       this.app.use(controller.router.allowedMethods());
//     });
//   }

//   private LoadHandleError(): void {
//     this.app.on("error", (err: ApplicationError, context: Context) => {
//       const result = new Result();
//       if (err.name && err.name === "ApplicationError") {
//         console.log("Controlled application error", err.message);
//         result.SetError(err.message, err.code);
//       } else {
//         console.log("No controlled application error", err);
//         result.SetMessage(config.params.defaultError.message);
//       }
//       context.status = result.statusCode;
//       context.body = result;
//     });
//   }

//   public Listen(): void {
//     this.app.listen(config.server.port, () => {
//       console.log(
//         `server running on ${config.server.host}:${config.server.port}`,
//       );
//     });
//   }
// }

// For ExpressJs
import config from "../config";
import { Application, Request, Response, NextFunction } from "../config";
import Result from "../../application/result/Result";
import { ApplicationError } from "../error/ApplicationError";
import localization from "../middlewares/localization";
import BaseController from "../../application/result/BaseController";

const jsonParser = config.coreModules.BodyParser.json();

export default class App {
  public app: Application;

  constructor(controllers: BaseController[]) {
    this.app = config.coreModules.Server();
    this.LoadMiddlewares();
    this.LoadControllers(controllers);
    this.LoadHandleError();
  }

  public LoadMiddlewares(): void {
    this.app.use(jsonParser);
    this.app.use(localization());
  }

  private LoadControllers(controllers: BaseController[]): void {
    controllers.forEach((controller) => {
      this.app.use(config.server.root, controller.router);
    });
  }

  private LoadHandleError(): void {
    this.app.use((err: ApplicationError, req: Request, res: Response, next: NextFunction) => {
      const result = new Result();
      if (err.name && err.name === "ApplicationError") {
        console.log("Controlled application error", err.message);
        result.SetError(err.message, err.code);
      } else {
        console.log("No controlled application error", err);
        result.SetMessage(config.params.defaultError.message);
      }
      if (res.headersSent) {
        return next(result);
      }
      res.status(result.statusCode).send(result);
    });
  }

  public Listen(): void {
    this.app.listen(config.server.port, () => {
      console.log(`server running on ${config.server.host}:${config.server.port}`);
    });
  }
}
