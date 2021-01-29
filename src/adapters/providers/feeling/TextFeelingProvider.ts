import httpClient, { Headers } from "../../../infrastructure/httpClient";
import { IFeelingQueryService } from "../../../application/modules/feeling/serviceContracts/queryServices/IFeelingQueryService";
import * as applicationStatusCodes from "../../../application/shared/status/applicationStatusCodes.json";
import { ApplicationError } from "../../../application/shared/errors/ApplicationError";
import { ITextFeeling } from "../../../domain/textFeeling/TextFeeling.interface";
import { TextDto } from "../../../application/modules/feeling/dtos/TextReq.dto";
import { TextFeeling } from "../../../domain/textFeeling/TextFeeling";
import { TextFeelingRepoModel } from "./models/TextFeeling.model";
import { Sentiment } from "../../../domain/sentence/Sentiment";

const TEXT_FEELING_MOCK_API = "https://run.mocky.io/v3/601532db-605a-4458-bf5a-e6bbfddaa7b6";

export default class TextFeelingProvider implements IFeelingQueryService {
  async AnalyzeText(text: string): Promise<ITextFeeling> {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Accept", "application/json");
    const content = new TextDto();
    content.text = text;
    try {
      const tResponse = await httpClient.Send<TextFeelingRepoModel>(
        TEXT_FEELING_MOCK_API,
        httpClient.Methods.POST,
        {
          body: JSON.stringify(content),
          headers: headers,
          serializationMethod: httpClient.SerializationMethod.json,
        },
      );
      const response = tResponse.response as TextFeelingRepoModel;
      if (!tResponse.success) {
        throw new ApplicationError(
          tResponse.message,
          tResponse.statusCode || applicationStatusCodes.INTERNAL_SERVER_ERROR,
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
        error.code || applicationStatusCodes.INTERNAL_SERVER_ERROR,
        JSON.stringify(error),
      );
    }
  }
}
