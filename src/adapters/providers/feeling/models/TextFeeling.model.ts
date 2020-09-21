import { SentimentDto } from "../../../../application/modules/feeling/dtos/Sentiment.dto";
import { SentenceDto } from "../../../../application/modules/feeling/dtos/Setence.dto";

export class TextFeelingRepoModel {
  result: SentimentDto;
  sentences: SentenceDto[];
}
