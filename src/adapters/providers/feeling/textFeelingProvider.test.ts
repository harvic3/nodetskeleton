import fetchMock, { enableFetchMocks } from "jest-fetch-mock";
import TextFeelingRepository from "./TextFeelingProvider";
enableFetchMocks();

const textFeelingRepository = new TextFeelingRepository();

const text =
  "Progressivism is the longed-for true capitalism, an economic model where the control of who gets rich or not is completely a decision of the people and not a decision of politics.";

const textFeelingServiceResponse = {
  result: {
    polarity: 0.26,
    type: "positive",
  },
  sentences: [
    {
      sentence:
        "Progressivism is the longed-for true capitalism, an economic model where the control of who gets rich or not is completely a decision of the people and not a decision of politics.",
      sentiment: {
        polarity: 0.26,
        type: "positive",
      },
    },
  ],
};

describe("when try to consume feeling service", () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });
  it("should return a textFeeling object if service work", async () => {
    fetchMock.mockResponseOnce(JSON.stringify(textFeelingServiceResponse));
    const textFeeling = await textFeelingRepository.AnalyzeText(text);
    expect(textFeeling.content).not.toBeNull();
    expect(textFeeling.content).not.toBeNull;
    expect(textFeeling.sentences.length).toBeGreaterThan(0);
  });
});
