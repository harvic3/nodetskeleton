import { Sentiment } from "../../../../../domain/sentence/Sentiment";
import { Sentence } from "../../../../../domain/sentence/Sentence";
import { ITextFeeling } from "../../../../../domain/textFeeling/TextFeeling.interface";

export interface ITextFeelingService {
  GetFeelingText(text: string): Promise<ITextFeeling>;
  GetSentimentText(text: string): Promise<Sentiment>;
  GetHighestFeelingSentence(text: string): Promise<Sentence>;
  GetLowestFeelingSentence(text: string): Promise<Sentence>;
}
