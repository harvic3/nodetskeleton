import { IFeelingQueryService } from "../../serviceContracts/queryServices/IFeelingQueryService";
import TextFeelingService from "../../serviceContracts/textFeeling/TextFeelingService";
import resources, { resourceKeys } from "../../../../shared/locals/index";
import * as applicationStatusCodes from "../../../../shared/status/applicationStatusCodes.json";
import { textFeelingResponse } from "../../../../mocks/textFeeling.mock";
import { TextFeelingDto } from "../../dtos/TextFeeling.dto";
import { textDto } from "../../../../mocks/textDto.mock";
import { UseCaseGetFeeling } from "./index";
import { mock } from "jest-mock-extended";

const defaultLanguage = "en";
const textFeelingQueryServiceMock = mock<IFeelingQueryService>();
const textFeelingService = new TextFeelingService(textFeelingQueryServiceMock);
const getFeelingUseCase = new UseCaseGetFeeling(textFeelingService);

describe("when try to analyze feeling for text", () => {
  beforeAll(() => {
    resources.setDefaultLanguage(defaultLanguage);
  });
  beforeEach(() => {
    textFeelingQueryServiceMock.analyzeText.mockReset();
  });
  it("should return a 400 error if dto is null", async () => {
    const result = await getFeelingUseCase.execute(null);
    expect(result.statusCode).toBe(applicationStatusCodes.BAD_REQUEST);
    expect(result.error).toBe(
      resources.getWithParams(resourceKeys.SOME_PARAMETERS_ARE_MISSING, {
        missingParams: "textDto, text",
      }),
    );
    expect(result.success).toBeFalsy();
  });
  it("should return a 400 error if text in dto is null", async () => {
    const result = await getFeelingUseCase.execute({ text: null });
    expect(result.statusCode).toBe(applicationStatusCodes.BAD_REQUEST);
    expect(result.error).toBe(
      resources.getWithParams(resourceKeys.SOME_PARAMETERS_ARE_MISSING, {
        missingParams: "text",
      }),
    );
    expect(result.success).toBeFalsy();
  });
  it("should return a 500 error if feeling service fail", async () => {
    textFeelingQueryServiceMock.analyzeText.mockResolvedValue(null);
    const result = await getFeelingUseCase.execute(textDto);
    expect(result.statusCode).toBe(applicationStatusCodes.INTERNAL_SERVER_ERROR);
    expect(result.error).toBe(resources.get(resourceKeys.TEXT_FEELING_SERVICE_ERROR));
    expect(result.success).toBeFalsy();
  });
  it("should return success if dto have data and feeling service work", async () => {
    textFeelingQueryServiceMock.analyzeText.mockResolvedValue(textFeelingResponse);
    const result = await getFeelingUseCase.execute(textDto);
    const textFeeling = result.data as TextFeelingDto;
    expect(result.statusCode).toBe(applicationStatusCodes.SUCCESS);
    expect(textFeeling.content).not.toBeNull;
    expect(textFeeling.sentences.length).toBeGreaterThan(0);
    expect(result.success).toBeTruthy();
  });
});
