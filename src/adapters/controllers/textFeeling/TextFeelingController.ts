// For KoaJs
// import BaseController, { Context } from "../base/BaseController";
// import { TextDto } from "../../../application/modules/feeling/dtos/TextReq.dto";
// import {
//   getFeelingTextUseCase,
//   getHighestFeelingSentenceUseCase,
//   getLowestFeelingSentenceUseCase,
// } from "./container/index";

// class TextFeelingController extends BaseController {
//   public constructor() {
//     super();
//     this.initializeRoutes();
//   }

//   private initializeRoutes() {
//     this.router.post("/v1/feeling", this.getFeelingText);
//     this.router.post("/v1/feeling/highest", this.getHighestFeelingSentence);
//     this.router.post("/v1/feeling/lowest", this.getHighestFeelingSentence);
//   }

//   getFeelingText = async (context: Context): Promise<void> => {
//     const textDto: TextDto = context.request.body;
//     this.HandleResult(context, await getFeelingTextUseCase.execute(textDto));
//   };

//   getHighestFeelingSentence = async (context: Context): Promise<void> => {
//     const textDto: TextDto = context.request.body;
//     this.HandleResult(context, await getHighestFeelingSentenceUseCase.execute(textDto));
//   };

//   getLowestFeelingSentence = async (context: Context): Promise<void> => {
//     const textDto: TextDto = context.request.body;
//     this.HandleResult(context, await getLowestFeelingSentenceUseCase.execute(textDto));
//   };
// }

// const instance = new TextFeelingController();

// export default instance;

// For ExpressJs
import BaseController from "../base/BaseController";
import { Request, Response, NextFunction } from "../../../infrastructure/server/CoreModules";
import { TextDto } from "../../../application/modules/feeling/dtos/TextReq.dto";
import {
  getFeelingTextUseCase,
  getHighestFeelingSentenceUseCase,
  getLowestFeelingSentenceUseCase,
} from "./container/index";

class TextFeelingController extends BaseController {
  public constructor() {
    super();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post("/v1/feeling", this.getFeelingText);
    this.router.post("/v1/feeling/highest", this.getHighestFeelingSentence);
    this.router.post("/v1/feeling/lowest", this.getHighestFeelingSentence);
  }

  getFeelingText = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const textDto: TextDto = req.body;
      this.handleResult(res, await getFeelingTextUseCase.execute(textDto));
    } catch (error) {
      next(error);
    }
  };

  getHighestFeelingSentence = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const textDto: TextDto = req.body;
      this.handleResult(res, await getHighestFeelingSentenceUseCase.execute(textDto));
    } catch (error) {
      next(error);
    }
  };

  getLowestFeelingSentence = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const textDto: TextDto = req.body;
      this.handleResult(res, await getLowestFeelingSentenceUseCase.execute(textDto));
    } catch (error) {
      next(error);
    }
  };
}

const instance = new TextFeelingController();

export default instance;
