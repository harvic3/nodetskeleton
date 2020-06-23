import { ITextFeeling } from "../../domain/textFeeling/TextFeeling.interface";
import { IFeelingQueryService } from "../../domainServices/queryServices/IFeelingQuery.service";

export interface IFeelingRepository extends IFeelingQueryService {
  AnaliceText(text: string): Promise<ITextFeeling>;
}
