import httpClient, { Headers } from "../../../infrastructure/httpClient";
import { IFeelingQueryService } from "../../../application/modules/feeling/serviceContracts/queryServices/IFeelingQueryService";
import { ApplicationError } from "../../../application/shared/errors/ApplicationError";
import { ITextFeeling } from "../../../domain/textFeeling/TextFeeling.interface";
import { TextFeelingRepoModel } from "./models/TextFeeling.model";
import { TextFeeling } from "../../../domain/textFeeling/TextFeeling";
import { Sentiment } from "../../../domain/sentence/Sentiment";
import { TextDto } from "../../../application/modules/feeling/dtos/TextReq.dto";
import * as resultCodes from "../../../application/shared/result/resultCodes.json";

const textFeelingApi = "https://sentim-api.herokuapp.com/api/v1/";

export default class TextFeelingProvider implements IFeelingQueryService {
  async AnalyzeText(text: string): Promise<ITextFeeling> {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Accept", "application/json");
    const content = new TextDto();
    content.text = text;
    try {
      const tResponse = await httpClient.Send<TextFeelingRepoModel>(
        textFeelingApi,
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
          tResponse.statusCode || resultCodes.INTERNAL_SERVER_ERROR,
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
        error.code || resultCodes.INTERNAL_SERVER_ERROR,
        JSON.stringify(error),
      );
    }
  }
}
