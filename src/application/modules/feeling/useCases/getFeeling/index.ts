import { BaseUseCase, IResultT, ResultT } from "../../../../shared/useCase/BaseUseCase";
import { ITextFeelingService } from "../../serviceContracts/textFeeling/ITextFeelingService";
import { TextFeeling } from "../../../../../domain/textFeeling/TextFeeling";
import { TextFeelingDto } from "../../dtos/TextFeeling.dto";
import { TextDto } from "../../dtos/TextReq.dto";

export class UseCaseGetFeeling extends BaseUseCase {
  public constructor(private textFeelingService: ITextFeelingService) {
    super();
  }

  async Execute(textDto: TextDto): Promise<IResultT<TextFeelingDto>> {
    const result = new ResultT<TextFeelingDto>();
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
