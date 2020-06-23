import { mock, MockProxy } from "jest-mock-extended";
import { FeelingQueryService } from "../src/domainServices/queryServices/FeelingQuery.service";
import { IFeelingRepository } from "../src/application/repositories/Feeling.repo.interface";
import { TextFeeling } from "../src/domain/textFeeling/TextFeeling";

let FeelingRepoMock = mock<IFeelingRepository>();

const request = {
  text: "Progressivism is the longed-for true capitalism, an economic model where the control of who gets rich or not is completely a decision of the people and not a decision of politics."
}

const apiResponse = {
  result: {
    polarity: 0.26,
    type: "positive",
  },
  sentences: [
    {
      sentence:
        request.text,
      sentiment: {
        polarity: 0.26,
        type: "positive",
      },
    },
  ],
};

describe("when evaluateText is called", () => {
  it("Feeling repo should return a ITextFeeling type", async () => {
    
  });
});
