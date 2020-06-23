import Result from "../../result/generic/Result";
import { ITextFeelingService } from "./TextFeeling.service.interface";
import { Sentiment } from "../../../domain/sentence/Sentiment";
import { Sentence } from "../../../domain/sentence/Sentence";
import { IResult } from "../../result/generic/Result.interface";
import { ITextFeeling } from "../../../domain/textFeeling/TextFeeling.interface";
import { TextFeeling } from "../../../domain/textFeeling/TextFeeling";
import { IFeelingQueryService } from "../../../domainServices/queryServices/IFeelingQuery.service";

export default class TextFeelingService implements ITextFeelingService {
  private textFeelingQueryService: IFeelingQueryService;
  public constructor(textFeelingQueryService: IFeelingQueryService) {
    this.textFeelingQueryService = textFeelingQueryService;
  }
  async GetFeelingText(text: string): Promise<IResult<ITextFeeling>> {
    const result = new Result<TextFeeling>();
    const textFeeling = await this.textFeelingQueryService.AnaliceText(text);
    result.SetSuccessful(textFeeling);
    return result;
  }
  async GetSentimentText(text: string): Promise<IResult<Sentiment>> {
    const result = new Result<Sentiment>();
    const textFeeling = await this.textFeelingQueryService.AnaliceText(text);
    result.SetSuccessful(textFeeling.GetFeelingText());
    return result;
  }
  async GetHighestFeelingSentence(text: string): Promise<IResult<Sentence>> {
    const result = new Result<Sentence>();
    const textFeeling = await this.textFeelingQueryService.AnaliceText(text);
    result.SetSuccessful(textFeeling.GetHighestFeelingSentence());
    return result;
  }
  async GetLowestFeelingSentence(text: string): Promise<IResult<Sentence>> {
    const result = new Result<Sentence>();
    const textFeeling = await this.textFeelingQueryService.AnaliceText(text);
    result.SetSuccessful(textFeeling.GetLowestFeelingSentence());
    return result;
  }
}
