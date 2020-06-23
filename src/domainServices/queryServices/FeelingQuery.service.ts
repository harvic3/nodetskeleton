import { IFeelingQueryService } from "./IFeelingQuery.service";
import { IFeelingRepository } from "../../application/repositories/Feeling.repo.interface";
import { ITextFeeling } from "../../domain/textFeeling/TextFeeling.interface";

export class FeelingQueryService implements IFeelingQueryService {
  private repository: IFeelingRepository;
  public constructor(repository: IFeelingRepository) {
    this.repository = repository;
  }
  async AnaliceText(text: string): Promise<ITextFeeling> {
    return await this.repository.AnaliceText(text);
  }
}
