import TextFeelingRepository from "../../../providers/feeling/TextFeelingRepository";
import TextFeelingService from "../../../../application/modules/feeling/services/textFeeling/TextFeeling.service";
import { UseCaseGetFeeling } from "../../../../application/modules/feeling/useCases/getFeeling";
import { UseCaseGetHighestFeelingSentence } from "../../../../application/modules/feeling/useCases/getHighest";
import { UseCaseGetLowestFeelingSentence } from "../../../../application/modules/feeling/useCases/getLowest";

const textFeelingRepo = new TextFeelingRepository();
const textFeelingService = new TextFeelingService(textFeelingRepo);
const getFeelingTextUseCase = new UseCaseGetFeeling(textFeelingService);
const getHighestFeelingSentenceUseCase = new UseCaseGetHighestFeelingSentence(textFeelingService);
const getLowestFeelingSentenceUseCase = new UseCaseGetLowestFeelingSentence(textFeelingService);

export { getFeelingTextUseCase, getHighestFeelingSentenceUseCase, getLowestFeelingSentenceUseCase };
