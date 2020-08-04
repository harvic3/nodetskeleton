import { IFeelingQueryService } from "./IFeelingQuery.service.interface";
import { TextFeeling } from "../../../../../domain/textFeeling/TextFeeling";

export class FeelingQueryService implements IFeelingQueryService {
  private repository: IFeelingQueryService;
  public constructor(repository: IFeelingQueryService) {
    this.repository = repository;
  }
  async AnaliceText(text: string): Promise<TextFeeling> {
    return await this.repository.AnaliceText(text);
  }
}
