import { TextFeeling } from "../../domain/textFeeling/TextFeeling";
import { textDto } from "./textDto.mock";
import { sentence } from "./sentence.mock";
import { sentiment } from "./sentiment.mock";

const textFeelingResponse = new TextFeeling(textDto.text);
textFeelingResponse.SetSentences([sentence]);
textFeelingResponse.SetSentiment(sentiment);

export { textFeelingResponse };
