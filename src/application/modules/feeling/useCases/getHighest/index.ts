import { BaseUseCase, IResultT, ResultT } from "../../../../shared/useCase/BaseUseCase";
import { ITextFeelingService } from "../../serviceContracts/textFeeling/ITextFeelingService";
import { TextDto } from "../../dtos/TextReq.dto";
import { Sentence } from "../../../../../domain/sentence/Sentence";

export class UseCaseGetHighestFeelingSentence extends BaseUseCase {
  public constructor(private textFeelingService: ITextFeelingService) {
    super();
  }

  async Execute(textDto: TextDto): Promise<IResultT<Sentence>> {
    const result = new ResultT<Sentence>();
    if (!this.validator.IsValidEntry(result, { textDto: textDto, text: textDto?.text })) {
      return result;
    }
    const sentence = await this.textFeelingService.GetHighestFeelingSentence(textDto.text);
    if (!sentence) {
      result.SetError(
        this.resources.Get(this.resourceKeys.TEXT_FEELING_SERVICE_ERROR),
        this.resultCodes.INTERNAL_SERVER_ERROR,
      );
      return result;
    }
    result.SetData(sentence, this.resultCodes.SUCCESS);
    return result;
  }
}
