import { IFeelingQueryService } from "../../serviceContracts/queryServices/IFeelingQueryService";
import TextFeelingService from "../../serviceContracts/textFeeling/TextFeelingService";
import resources, { resourceKeys } from "../../../../shared/locals/index";
import * as resultCodes from "../../../../shared/result/resultCodes.json";
import { textFeelingResponse } from "../../../../mocks/textFeeling.mock";
import { TextFeelingDto } from "../../dtos/TextFeeling.dto";
import { textDto } from "../../../../mocks/textDto.mock";
import { UseCaseGetFeeling } from "./index";
import { mock } from "jest-mock-extended";

const textFeelingQueryServiceMock = mock<IFeelingQueryService>();
const textFeelingService = new TextFeelingService(textFeelingQueryServiceMock);
const getFeelingUseCase = new UseCaseGetFeeling(textFeelingService);

describe("when try to analyze feeling for text", () => {
  beforeEach(() => {
    textFeelingQueryServiceMock.AnalyzeText.mockReset();
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
    textFeelingQueryServiceMock.AnalyzeText.mockResolvedValue(null);
    const result = await getFeelingUseCase.Execute(textDto);
    expect(result.statusCode).toBe(resultCodes.INTERNAL_SERVER_ERROR);
    expect(result.error).toBe(resources.Get(resourceKeys.TEXT_FEELING_SERVICE_ERROR));
    expect(result.success).toBeFalsy();
  });
  it("should return success if dto have data and feeling service work", async () => {
    textFeelingQueryServiceMock.AnalyzeText.mockResolvedValue(textFeelingResponse);
    const result = await getFeelingUseCase.Execute(textDto);
    const textFeeling = result.data as TextFeelingDto;
    expect(result.statusCode).toBe(resultCodes.SUCCESS);
    expect(textFeeling.content).not.toBeNull;
    expect(textFeeling.sentences.length).toBeGreaterThan(0);
    expect(result.success).toBeTruthy();
  });
});
