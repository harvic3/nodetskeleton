import { SentimentDto } from "../../dtos/Sentiment.dto";
import { SentenceDto } from "../../dtos/Setence.dto";

export class TextFeelinRepoModel {
  result: SentimentDto;
  sentences: SentenceDto[];
}
