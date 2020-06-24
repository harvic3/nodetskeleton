import { IFeelingQueryService } from "./IFeelingQuery.service.interface";
import { ITextFeeling } from "../../domain/textFeeling/TextFeeling.interface";

export class FeelingQueryService implements IFeelingQueryService {
  private repository: IFeelingQueryService;
  public constructor(repository: IFeelingQueryService) {
    this.repository = repository;
  }
  async AnaliceText(text: string): Promise<ITextFeeling> {
    return await this.repository.AnaliceText(text);
  }
}
