import { mock } from "jest-mock-extended";
import { TextDto } from "../../dtos/TextReq.dto";
import { UseCaseGetFeeling } from ".";
import TextFeelingService from "../../services/textFeeling/TextFeeling.service";
import { IFeelingQueryService } from "../../services/queryServices/IFeelingQuery.service.interface";
import resources, { resourceKeys } from "../../../../shared/locals/index";
import * as resultCodes from "../../../../shared/result/resultCodes.json";
import { TextFeelingDto } from "../../dtos/TextFeeling.dto";
import { TextFeeling } from "../../../../../domain/textFeeling/TextFeeling";
import { Sentence } from "../../../../../domain/sentence/Sentence";
import { Sentiment } from "../../../../../domain/sentence/Sentiment";

const textFeelingQueryServiceMock = mock<IFeelingQueryService>();
const textFeelingService = new TextFeelingService(textFeelingQueryServiceMock);
const getFeelingUseCase = new UseCaseGetFeeling(textFeelingService);

const textDto = new TextDto();
textDto.text =
  "Progressivism is the longed-for true capitalism, an economic model where the control of who gets rich or not is completely a decision of the people and not a decision of politics.";

const textFeelingResponse = new TextFeeling(textDto.text);
const sentiment = new Sentiment(0.26, "positive");
const sentence = new Sentence(textDto.text, sentiment);
textFeelingResponse.SetSentences([sentence]);
textFeelingResponse.SetSentiment(sentiment);

describe("when try to analize feeling for text", () => {
  beforeEach(() => {
    textFeelingQueryServiceMock.AnaliceText.mockReset();
  });
  it("should return a 400 error if dto is null", async () => {
    const result = await getFeelingUseCase.Execute(null);
    expect(result.statusCode).toBe(resultCodes.BAD_REQUEST);
    expect(result.error).toBe(
      resources.GetWithParams(resourceKeys.SOME_PARAMETERS_ARE_MISSING, {
        missingParams: "textDto, text",
      }),
    );
    expect(result.success).toBeFalsy();
  });
  it("should return a 400 error if text in dto is null", async () => {
    const result = await getFeelingUseCase.Execute({ text: null });
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
    const result = await getFeelingUseCase.Execute(textDto);
    expect(result.statusCode).toBe(resultCodes.INTERNAL_SERVER_ERROR);
    expect(result.error).toBe(resources.Get(resourceKeys.TEXT_FEELING_SERVICE_ERROR));
    expect(result.success).toBeFalsy();
  });
  it("should return success if dto have data and feeling service work", async () => {
    textFeelingQueryServiceMock.AnaliceText.mockResolvedValue(textFeelingResponse);
    const result = await getFeelingUseCase.Execute(textDto);
    const textFeeling = result.data as TextFeelingDto;
    expect(result.statusCode).toBe(resultCodes.SUCCESS);
    expect(textFeeling.content).not.toBeNull;
    expect(textFeeling.sentences.length).toBeGreaterThan(0);
    expect(result.success).toBeTruthy();
  });
});
