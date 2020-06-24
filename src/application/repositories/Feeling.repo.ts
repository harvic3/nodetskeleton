import HttpClient from "../../infraestructure/httpClient";
import ClientHeaders from "../../infraestructure/httpClient/Headers";
import * as HttpError from "http-errors";
import { ITextFeeling } from "../../domain/textFeeling/TextFeeling.interface";
import { TextFeelinRepoModel } from "./models/TextFeelingRepo.model";
import { TextFeeling } from "../../domain/textFeeling/TextFeeling";
import { Sentiment } from "../../domain/sentence/Sentiment";
import { TextDto } from "../dtos/TextReq.dto";
import { IFeelingQueryService } from "../../domainServices/queryServices/IFeelingQuery.service.interface";

const textFeelingApi = "https://sentim-api.herokuapp.com/api/v1/";

export default class TextFeelingRepo implements IFeelingQueryService {
  async AnaliceText(text: string): Promise<ITextFeeling> {
    const headers = new ClientHeaders();
    headers.Add("Content-Type", "application/json");
    headers.Add("Accept", "application/json");
    const content = new TextDto();
    content.text = text;
    try {
      const tResponse = await HttpClient.SendAsync<TextFeelinRepoModel>(
        textFeelingApi,
        HttpClient.Method.POST,
        content,
        headers,
      );
      if (!tResponse.success) {
        throw HttpError(tResponse.statusCode || 500, tResponse.message);
      }
      const result = new TextFeeling(text);
      result.sentiment = new Sentiment(
        tResponse.response.result.polarity,
        tResponse.response.result.type,
      );
      result.sentences = tResponse.response.sentences;
      return result;
    } catch (error) {
      throw HttpError(error.statusCode || 500, error.message);
    }
  }
}
