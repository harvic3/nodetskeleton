import { Sentence } from "../../domain/sentence/Sentence";
import { sentiment } from "./sentiment.mock";
import { textDto } from "./textDto.mock";

const sentence = new Sentence(textDto.text, sentiment);

export { sentence };
