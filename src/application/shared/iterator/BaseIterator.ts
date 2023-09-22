import { BaseUseCase, ResultT } from "../useCase/BaseUseCase";
import { LocaleTypeEnum } from "../locals/LocaleType.enum";
import { UseCaseTrace } from "../log/UseCaseTrace";

export abstract class BaseIterator<InputType, OutputType> {
  readonly #taskIterator: Generator<BaseUseCase<any>>;

  constructor(useCases: BaseUseCase<any>[]) {
    this.#taskIterator = this.createTaskIterator(useCases);
  }

  private *createTaskIterator(tasks: BaseUseCase<any>[]): Generator<BaseUseCase<any>> {
    for (const task of tasks) {
      yield task;
    }
  }

  /**
   * @param locale
   * @param trace
   * @param args
   * @returns
   * @description
   * This method executes the use cases in the order they were added.
   * If the execution of a UseCase fails, the execution of the next use cases are not performed.
   * The iterator use the result data (result.data) of the previous task (UseCase) as the input of the next task (UseCase).
   **/
  async iterate(
    locale: LocaleTypeEnum,
    trace: UseCaseTrace,
    args?: InputType,
  ): Promise<ResultT<OutputType>> {
    let task = this.#taskIterator.next();
    let result = (await task.value.execute(locale, trace, args)) as ResultT<any>;

    for (task = this.#taskIterator.next(); !task.done; task = this.#taskIterator.next()) {
      if (!result.success) break;
      // You should use the result data of the previous task as the input of the next task
      result = (await task.value.execute(locale, trace, result?.data)) as ResultT<any>;
      // If you need to change the input for each use case, so contact me to get support ;)
    }

    return Promise.resolve(result);
  }
}
