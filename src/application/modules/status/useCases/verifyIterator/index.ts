import { BaseIterator } from "../../../../shared/iterator/BaseIterator";
import ArrayUtil from "../../../../../domain/shared/utils/ArrayUtil";
import { BaseUseCase } from "../../../../shared/useCase/BaseUseCase";
import { PongUseCase } from "../pong";

export class VerifyStatusIterator extends BaseIterator<
  { counter: number },
  {
    message: string;
    counter: number;
  }
> {
  constructor(useCases: {
    one: PongUseCase;
    two: PongUseCase;
    three: PongUseCase;
    four: PongUseCase;
  }) {
    super(ArrayUtil.fromObject<BaseUseCase<any>>(useCases));
  }
}
