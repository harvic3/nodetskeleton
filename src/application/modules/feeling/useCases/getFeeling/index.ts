import { BaseUseCase, IResultT, ResultT } from "../../../../shared/useCase/BaseUseCase";
import { ITextFeelingService } from "../../serviceContracts/textFeeling/ITextFeelingService";
import { TextFeeling } from "../../../../../domain/textFeeling/TextFeeling";
import { TextFeelingDto } from "../../dtos/TextFeeling.dto";
import { TextDto } from "../../dtos/TextReq.dto";

export class UseCaseGetFeeling extends BaseUseCase {
  public constructor(private textFeelingService: ITextFeelingService) {
    super();
  }

  async execute(textDto: TextDto): Promise<IResultT<TextFeelingDto>> {
    const result = new ResultT<TextFeelingDto>();
    if (!this.validator.isValidEntry(result, { textDto: textDto, text: textDto?.text })) {
      return result;
    }
    const textFeeling = await this.textFeelingService.getFeelingText(textDto.text);
    if (!textFeeling) {
      result.setError(
        this.resources.get(this.resourceKeys.TEXT_FEELING_SERVICE_ERROR),
        this.applicationStatusCode.INTERNAL_SERVER_ERROR,
      );
      return result;
    }
    const textFeelingDto = this.mapper.mapObject<TextFeeling, TextFeelingDto>(
      textFeeling,
      new TextFeelingDto(),
    );
    result.setData(textFeelingDto, this.applicationStatusCode.SUCCESS);
    return result;
  }
}
