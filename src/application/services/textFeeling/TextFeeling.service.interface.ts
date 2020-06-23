import { Sentiment } from "../../../domain/sentence/Sentiment";
import { Sentence } from "../../../domain/sentence/Sentence";
import { IResult } from "../../result/generic/Result.interface";
import { ITextFeeling } from "../../../domain/textFeeling/TextFeeling.interface";

export interface ITextFeelingService {
  GetFeelingText(text: string): Promise<IResult<ITextFeeling>>;
  GetSentimentText(text: string): Promise<IResult<Sentiment>>;
  GetHighestFeelingSentence(text: string): Promise<IResult<Sentence>>;
  GetLowestFeelingSentence(text: string): Promise<IResult<Sentence>>;
}