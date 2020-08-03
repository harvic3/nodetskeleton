// // For KoaJs
// import config from "../infraestructure/config";
// import BaseController from "../application/result/BaseController";
// import { Context } from "../infraestructure/config";
// import {
//   getFeelingTextUseCase,
//   getHighestFeelingSentenceUseCase,
//   getLowestFeelingSentenceUseCase,
// } from "./container/index";

// const apiRoot = config.server.root;

// class TextFeelingController extends BaseController {
//   public router = new config.coreModules.Router();
//   private textFeelingService: ITextFeelingService;

//   public constructor() {
//     super();
//     this.textFeelingService = new TextFeelingService(new FeelingRepo());
//     this.InitializeRoutes();
//   }

//   private InitializeRoutes() {
//     this.router.post(`${apiRoot}/feeling`, this.GetFeelingText);
//     this.router.post(
//       `${apiRoot}/feeling/highest`,
//       this.GetHighestFeelingSentence,
//     );
//     this.router.post(
//       `${apiRoot}/feeling/lowest`,
//       this.GetHighestFeelingSentence,
//     );
//   }

//   GetFeelingText = async (ctx: Context): Promise<void> => {
//     const textDto: TextDto = req.body;
//     this.HandleResult(
//       ctx,
//       await getFeelingTextUseCase.Execute(textDto),
//     );
//   };
//   GetHighestFeelingSentence = async (ctx: Context): Promise<void> => {
//     const textDto: TextDto = req.body;
//     this.HandleResult(
//       ctx,
//       await getHighestFeelingSentenceUseCase.Execute(textDto),
//     );
//   };
//   GetLowestFeelingSentence = async (ctx: Context): Promise<void> => {
//     const textDto: TextDto = req.body;
//     this.HandleResult(
//       ctx,
//       await getLowestFeelingSentenceUseCase.Execute(textDto),
//     );
//   };
// }

// const instance = new TextFeelingController();

// export default instance;

// For ExpressJs
import BaseController from "../BaseController";
import { Request, Response, NextFunction } from "../../../infraestructure/server/CoreModules";
import { TextDto } from "../../../application/modules/feeling/dtos/TextReq.dto";
import {
  getFeelingTextUseCase,
  getHighestFeelingSentenceUseCase,
  getLowestFeelingSentenceUseCase,
} from "./container/index";

class TextFeelingController extends BaseController {
  public constructor() {
    super();
    this.InitializeRoutes();
  }

  private InitializeRoutes() {
    this.router.post("/feeling", this.GetFeelingText);
    this.router.post("/feeling/highest", this.GetHighestFeelingSentence);
    this.router.post("/feeling/lowest", this.GetHighestFeelingSentence);
  }

  GetFeelingText = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const textDto: TextDto = req.body;
      this.HandleResult(res, await getFeelingTextUseCase.Execute(textDto));
    } catch (error) {
      next(error);
    }
  };
  GetHighestFeelingSentence = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const textDto: TextDto = req.body;
      this.HandleResult(res, await getHighestFeelingSentenceUseCase.Execute(textDto));
    } catch (error) {
      next(error);
    }
  };
  GetLowestFeelingSentence = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const textDto: TextDto = req.body;
      this.HandleResult(res, await getLowestFeelingSentenceUseCase.Execute(textDto));
    } catch (error) {
      next(error);
    }
  };
}

const instance = new TextFeelingController();

export default instance;
