// // For KoaJs
// import config from "../infraestructure/config";
// import BaseController from "../application/result/BaseController";
// import { Context } from "../infraestructure/config";

// import { ITextFeelingService } from "../application/services/textFeeling/TextFeeling.service.interface";
// import TextFeelingService from "../application/services/textFeeling/TextFeeling.service";
// import FeelingRepo from "../application/repositories/Feeling.repo";

// const apiRoot = config.server.root;

// export default class TextFeelingController extends BaseController {
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
//     this.HandleResult(
//       ctx,
//       await this.textFeelingService.GetFeelingText(ctx.request.body.text),
//     );
//   };
//   GetHighestFeelingSentence = async (ctx: Context): Promise<void> => {
//     this.HandleResult(
//       ctx,
//       await this.textFeelingService.GetFeelingText(ctx.request.body.text),
//     );
//   };
//   GetLowestFeelingSentence = async (ctx: Context): Promise<void> => {
//     this.HandleResult(
//       ctx,
//       await this.textFeelingService.GetFeelingText(ctx.request.body.text),
//     );
//   };
// }

// For ExpressJs
import config from "../infraestructure/config";
import BaseController from "../application/result/BaseController";
import { Request, Response, NextFunction } from "../infraestructure/config";

import { ITextFeelingService } from "../application/services/textFeeling/TextFeeling.service.interface";
import TextFeelingService from "../application/services/textFeeling/TextFeeling.service";
import FeelingRepo from "../application/repositories/Feeling.repo";
import * as asyncHandler from "express-async-await";

const jsonParser = config.coreModules.BodyParser.json();

export default class TextFeelingController extends BaseController {
  public router = config.coreModules.Router();
  private textFeelingService: ITextFeelingService;

  public constructor() {
    super();
    this.textFeelingService = new TextFeelingService(new FeelingRepo());
    this.InitializeRoutes();
  }

  private InitializeRoutes() {
    this.router.post("/feeling", jsonParser, asyncHandler(this.GetFeelingText));
    this.router.post(
      "/feeling/highest",
      jsonParser,
      asyncHandler(this.GetHighestFeelingSentence),
    );
    this.router.post(
      "/feeling/lowest",
      jsonParser,
      asyncHandler(this.GetHighestFeelingSentence),
    );
  }

  GetFeelingText = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      this.HandleResult(
        res,
        await this.textFeelingService.GetFeelingText(req.body.text),
      );
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
      this.HandleResult(
        res,
        await this.textFeelingService.GetHighestFeelingSentence(req.body.text),
      );
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
      this.HandleResult(
        res,
        await this.textFeelingService.GetLowestFeelingSentence(req.body.text),
      );
    } catch (error) {
      next(error);
    }
  };
}
