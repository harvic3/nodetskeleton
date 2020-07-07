import httpClient, { Headers } from "../../infraestructure/httpClient";
import * as HttpError from "http-errors";
import { ITextFeeling } from "../../domain/textFeeling/TextFeeling.interface";
import { TextFeelinRepoModel } from "./models/TextFeelingRepo.model";
import { TextFeeling } from "../../domain/textFeeling/TextFeeling";
import { Sentiment } from "../../domain/sentence/Sentiment";
import { TextDto } from "../dtos/TextReq.dto";
import { IFeelingQueryService } from "../services/queryServices/IFeelingQuery.service.interface";

const textFeelingApi = "https://sentim-api.herokuapp.com/api/v1/";

export default class TextFeelingRepo implements IFeelingQueryService {
  async AnaliceText(text: string): Promise<ITextFeeling> {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Accept", "application/json");
    const content = new TextDto();
    content.text = text;
    try {
      const tResponse = await httpClient.SendAsync<TextFeelinRepoModel>(
        textFeelingApi,
        httpClient.Method.POST,
        {
          body: JSON.stringify(content),
          headers: headers,
          serializationMethod: httpClient.SerializationMethod.json,
        },
      );
      const response = tResponse.response as TextFeelinRepoModel;
      if (!tResponse.success) {
        throw HttpError(tResponse.statusCode || 500, tResponse.message);
      }
      const result = new TextFeeling(text);
      result.sentiment = new Sentiment(response.result.polarity, response.result.type);
      result.sentences = response.sentences;
      return result;
    } catch (error) {
      throw HttpError(error.statusCode || 500, error.message);
    }
  }
}
