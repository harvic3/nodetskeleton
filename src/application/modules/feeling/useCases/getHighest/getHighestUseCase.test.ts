import { mock } from "jest-mock-extended";
import { TextDto } from "../../dtos/TextReq.dto";
import { UseCaseGetHighestFeelingSentence } from ".";
import TextFeelingService from "../../services/textFeeling/TextFeeling.service";
import { IFeelingQueryService } from "../../services/queryServices/IFeelingQuery.service.interface";
import resources, { resourceKeys } from "../../../../shared/locals/index";
import * as resultCodes from "../../../../shared/result/resultCodes.json";
import { TextFeeling } from "../../../../../domain/textFeeling/TextFeeling";
import { Sentence } from "../../../../../domain/sentence/Sentence";
import { Sentiment } from "../../../../../domain/sentence/Sentiment";

const textFeelingQueryServiceMock = mock<IFeelingQueryService>();
const textFeelingService = new TextFeelingService(textFeelingQueryServiceMock);
const getHighestFeelingUseCase = new UseCaseGetHighestFeelingSentence(textFeelingService);

const textDto = new TextDto();
textDto.text =
  "Progressivism is the longed-for true capitalism, an economic model where the control of who gets rich or not is completely a decision of the people and not a decision of politics.";

const textFeelingResponse = new TextFeeling(textDto.text);
const sentiment = new Sentiment(0.26, "positive");
const sentence = new Sentence(textDto.text, sentiment);
textFeelingResponse.SetSentences([sentence]);
textFeelingResponse.SetSentiment(sentiment);

describe("when try to get a highest feeling sentence for text", () => {
  beforeEach(() => {
    textFeelingQueryServiceMock.AnaliceText.mockReset();
  });
  it("should return a 400 error if dto is null", async () => {
    const result = await getHighestFeelingUseCase.Execute(null);
    expect(result.statusCode).toBe(resultCodes.BAD_REQUEST);
    expect(result.error).toBe(
      resources.GetWithParams(resourceKeys.SOME_PARAMETERS_ARE_MISSING, {
        missingParams: "textDto, text",
      }),
    );
    expect(result.success).toBeFalsy();
  });
  it("should return a 400 error if text in dto is null", async () => {
    const result = await getHighestFeelingUseCase.Execute({ text: null });
    expect(result.statusCode).toBe(resultCodes.BAD_REQUEST);
    expect(result.error).toBe(
      resources.GetWithParams(resourceKeys.SOME_PARAMETERS_ARE_MISSING, {
        missingParams: "text",
      }),
    );
    expect(result.success).toBeFalsy();
  });
  it("should return a 500 error if feeling service fail", async () => {
    textFeelingQueryServiceMock.AnaliceText.mockResolvedValue(null);
    const result = await getHighestFeelingUseCase.Execute(textDto);
    expect(result.statusCode).toBe(resultCodes.INTERNAL_SERVER_ERROR);
    expect(result.error).toBe(resources.Get(resourceKeys.TEXT_FEELING_SERVICE_ERROR));
    expect(result.success).toBeFalsy();
  });
  it("should return success if dto have data and feeling service work", async () => {
    textFeelingQueryServiceMock.AnaliceText.mockResolvedValue(textFeelingResponse);
    const result = await getHighestFeelingUseCase.Execute(textDto);
    const sentence = result.data as Sentence;
    expect(result.statusCode).toBe(resultCodes.SUCCESS);
    expect(sentence.sentiment).not.toBeNull;
    expect(sentence.sentence).not.toBeNull;
    expect(result.success).toBeTruthy();
  });
});
