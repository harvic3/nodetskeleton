import { BaseUseCase } from "../../../../shared/useCase/BaseUseCase";
import { ITextFeelingService } from "../../services/textFeeling/TextFeeling.service.interface";
import { IResult } from "../../../../shared/result/generic/Result.interface";
import { Result } from "../../../../shared/result/generic/Result";
import { TextDto } from "../../dtos/TextReq.dto";
import { TextFeelingDto } from "../../dtos/TextFeeling.dto";
import { TextFeeling } from "../../../../../domain/textFeeling/TextFeeling";

export class UseCaseGetFeeling extends BaseUseCase {
  public constructor(private textFeelingService: ITextFeelingService) {
    super();
  }

  async Execute(textDto: TextDto): Promise<IResult<TextFeelingDto>> {
    const result = new Result<TextFeelingDto>();
    if (!this.validator.IsValidEntry(result, { textDto: textDto, text: textDto?.text })) {
      return result;
    }
    const textFeeling = await this.textFeelingService.GetFeelingText(textDto.text);
    if (!textFeeling) {
      result.SetError(
        this.resources.Get(this.resourceKeys.TEXT_FEELING_SERVICE_ERROR),
        this.resultCodes.INTERNAL_SERVER_ERROR,
      );
      return result;
    }
    const textFeelingDto = this.mapper.MapObject<TextFeeling, TextFeelingDto>(
      textFeeling,
      new TextFeelingDto(),
    );
    result.SetData(textFeelingDto, this.resultCodes.SUCCESS);
    return result;
  }
}
