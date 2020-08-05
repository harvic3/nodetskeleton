import BaseController from "../BaseController";
import { Context } from "../../../infrastructure/server/CoreModules";
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

  GetFeelingText = async (context: Context): Promise<void> => {
    const textDto: TextDto = context.request.body;
    this.HandleResult(context, await getFeelingTextUseCase.Execute(textDto));
  };
  GetHighestFeelingSentence = async (context: Context): Promise<void> => {
    const textDto: TextDto = context.request.body;
    this.HandleResult(context, await getHighestFeelingSentenceUseCase.Execute(textDto));
  };
  GetLowestFeelingSentence = async (context: Context): Promise<void> => {
    const textDto: TextDto = context.request.body;
    this.HandleResult(context, await getLowestFeelingSentenceUseCase.Execute(textDto));
  };
}

const instance = new TextFeelingController();

export default instance;
