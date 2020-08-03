import { BaseUseCase } from "../../../../shared/useCase/BaseUseCase";
import { ITextFeelingService } from "../../services/textFeeling/TextFeeling.service.interface";
import { IResult } from "../../../../shared/result/generic/Result.interface";
import Result from "../../../../shared/result/generic/Result";
import { TextDto } from "../../dtos/TextReq.dto";
import { ITextFeeling } from "../../../../../domain/textFeeling/TextFeeling.interface";

export class UseCaseGetFeeling extends BaseUseCase {
  public constructor(private textFeelingService: ITextFeelingService) {
    super();
  }

  async Execute(textDto: TextDto): Promise<IResult<ITextFeeling>> {
    const result = new Result<ITextFeeling>();
    if (!this.validator.IsValidEntry(result, { textDto: textDto, text: textDto.text })) {
      return result;
    }
    const textFeeling = await this.textFeelingService.GetFeelingText(textDto.text);
    result.SetData(textFeeling, this.resultCodes.SUCCESS);
    return result;
  }
}
