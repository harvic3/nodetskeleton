// // For KoaJs
// import config from "../config";
// import Result from "../../application/result/Result";

// const bodyParser = config.coreModules.BodyParser;

// export default class App {
//   public app: any;

//   constructor(controllers: any[]) {
//     this.app = new config.coreModules.Server();
//     this.LoadMiddlewares();
//     this.LoadControllers(controllers);
//     this.LoadHandleError();
//   }

//   public LoadMiddlewares() {
//     // Add other midlewares here
//     this.app.use(bodyParser());
//   }

//   private LoadControllers(controllers: any[]) {
//     controllers.forEach((controller) => {
//       this.app.use(controller.router.routes());
//       this.app.use(controller.router.allowedMethods());
//     });
//   }

//   private LoadHandleError() {
//     this.app.on("error", (err, context) => {
//       const result = new Result();
//       if (err.status) {
//         console.log("Controlled application error", err.message);
//         result.SetError(err.message, err.status);
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
import { Application } from "../config";
import Result from "../../application/result/Result";

export default class App {
  public app: Application;

  constructor(controllers: any[]){
    this.app = config.coreModules.Server();
    this.LoadMiddlewares();
    this.LoadControllers(controllers);
    this.LoadHandleError();
  }

  public LoadMiddlewares() {
    // Add midlewares here
  }

  private LoadControllers(controllers: any[]) {
    controllers.forEach((controller) => {
      this.app.use(config.server.root, controller.router);
    });
  }

  private LoadHandleError() {
    this.app.use((err, req, res, next) => {
      const result = new Result();
      if (err.status) {
        console.log("Controlled application error", err.message);
        result.SetError(err.message, err.status);
      } else {
        console.log("No controlled application error", err);
        result.SetMessage(config.params.defaultError.message);
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
