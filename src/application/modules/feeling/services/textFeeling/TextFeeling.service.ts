import { ITextFeelingService } from "./TextFeeling.service.interface";
import { Sentiment } from "../../../../../domain/sentence/Sentiment";
import { Sentence } from "../../../../../domain/sentence/Sentence";
import { ITextFeeling } from "../../../../../domain/textFeeling/TextFeeling.interface";
import { IFeelingQueryService } from "../queryServices/IFeelingQuery.service.interface";

export default class TextFeelingService implements ITextFeelingService {
  private textFeelingQueryService: IFeelingQueryService;
  public constructor(textFeelingQueryService: IFeelingQueryService) {
    this.textFeelingQueryService = textFeelingQueryService;
  }
  async GetFeelingText(text: string): Promise<ITextFeeling> {
    const textFeeling = await this.textFeelingQueryService.AnaliceText(text);
    return textFeeling || null;
  }
  async GetSentimentText(text: string): Promise<Sentiment> {
    const textFeeling = await this.textFeelingQueryService.AnaliceText(text);
    return textFeeling?.GetFeelingText() || null;
  }
  async GetHighestFeelingSentence(text: string): Promise<Sentence> {
    const textFeeling = await this.textFeelingQueryService.AnaliceText(text);
    return textFeeling?.GetHighestFeelingSentence() || null;
  }
  async GetLowestFeelingSentence(text: string): Promise<Sentence> {
    const textFeeling = await this.textFeelingQueryService.AnaliceText(text);
    return textFeeling?.GetLowestFeelingSentence() || null;
  }
}
