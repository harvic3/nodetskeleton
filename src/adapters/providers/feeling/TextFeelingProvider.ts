import { IFeelingQueryService } from "../../../application/modules/feeling/serviceContracts/queryServices/IFeelingQueryService";
import { ITextFeeling } from "../../../domain/textFeeling/TextFeeling.interface";
import { TextDto } from "../../../application/modules/feeling/dtos/TextReq.dto";
import httpClient, { Headers } from "../../../infrastructure/httpClient";
import { TextFeeling } from "../../../domain/textFeeling/TextFeeling";
import { ApplicationError, BaseProvider } from "../base/BaseProvider";
import { ITextFeelingResponse } from "./models/ITextFeelingResponse";
import { Sentiment } from "../../../domain/sentence/Sentiment";
import { ITextFeelingError } from "./models/ITextFeelingError";

const TEXT_FEELING_MOCK_API = "https://run.mocky.io/v3/601532db-605a-4458-bf5a-e6bbfddaa7b6";

export default class TextFeelingProvider extends BaseProvider implements IFeelingQueryService {
  async analyzeText(text: string): Promise<ITextFeeling> {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Accept", "application/json");
    const content = new TextDto();
    content.text = text;
    try {
      const tResponse = await httpClient.send<ITextFeelingResponse, ITextFeelingError>(
        TEXT_FEELING_MOCK_API,
        httpClient.Methods.POST,
        {
          body: JSON.stringify(content),
          headers: headers,
          serializationMethod: httpClient.SerializationMethod.json,
        },
      );
      const response = tResponse.response as ITextFeelingResponse;
      if (!tResponse.success) {
        throw new ApplicationError(
          tResponse.message,
          tResponse.statusCode || this.applicationStatusCode.INTERNAL_SERVER_ERROR,
          JSON.stringify(tResponse.error),
        );
      }
      const result = new TextFeeling(text);
      result.SetSentiment(new Sentiment(response.result.polarity, response.result.type));
      result.SetSentences(response.sentences);
      return result;
    } catch (error) {
      throw new ApplicationError(
        error.message,
        error.code || this.applicationStatusCode.INTERNAL_SERVER_ERROR,
        JSON.stringify(error),
      );
    }
  }
}
