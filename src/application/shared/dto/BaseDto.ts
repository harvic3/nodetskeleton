import { ApplicationStatus } from "../status/applicationStatus";
import messages, { Resources } from "../locals/messages";
import mapper, { IMap } from "../mapper/index";
import { Validator } from "../types";
import words from "../locals/words";

export { IResult } from "../types";

export abstract class BaseDto {
  readonly appMessages: Resources;
  readonly appWords: Resources;
  readonly mapper: IMap;
  readonly validator: Validator;

  constructor() {
    this.appMessages = messages;
    this.appWords = words;
    this.mapper = mapper;
    this.validator = new Validator(
      this.appMessages,
      this.appMessages.keys.SOME_PARAMETERS_ARE_MISSING,
      ApplicationStatus.INVALID_INPUT,
    );
  }
}
