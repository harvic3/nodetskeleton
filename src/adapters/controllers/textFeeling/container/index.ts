import { UseCaseGetHighestFeelingSentence } from "../../../../application/modules/feeling/useCases/getHighest";
import { UseCaseGetLowestFeelingSentence } from "../../../../application/modules/feeling/useCases/getLowest";
import { UseCaseGetFeeling } from "../../../../application/modules/feeling/useCases/getFeeling";
import { textFeelingService } from "../../../providers/container/index";

const getFeelingTextUseCase = new UseCaseGetFeeling(textFeelingService);
const getHighestFeelingSentenceUseCase = new UseCaseGetHighestFeelingSentence(textFeelingService);
const getLowestFeelingSentenceUseCase = new UseCaseGetLowestFeelingSentence(textFeelingService);

export { getFeelingTextUseCase, getHighestFeelingSentenceUseCase, getLowestFeelingSentenceUseCase };
